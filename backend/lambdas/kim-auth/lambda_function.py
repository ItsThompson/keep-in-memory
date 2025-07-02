# kim-auth

import boto3
import jwt
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    token = get_token(event)
    secret = get_secret()

    base_arn = '/'.join(event['methodArn'].split('/')[:-2])
    resources = [f"{base_arn}/*", f"{base_arn}/*/*"]

    if not token or not secret:
        print("Missing token or secret")
        return generate_policy('user', 'Deny', resources)

    player_id = None
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        player_id = decoded.get("player_id")
    except jwt.ExpiredSignatureError:
        # Token expired — ask client to refresh token
        print("Token expired")
        return generate_policy('user', 'Deny', resources)
    except jwt.InvalidTokenError:
        # Invalid token
        print("Invalid token")
        return generate_policy('user', 'Deny', resources)

    if not player_id:
        print("Authorization failed: No player_id in token")
        return generate_policy('user', 'Deny', resources)

    print(f"Authorization successful for player_id: {player_id}")
    print(f"Generating policy allowing invoke for resources: {resources}")
    return generate_policy(player_id,
                           'Allow',
                           resources,
                           context={'player_id': player_id})


def get_token(event):
    # Try event['authorizationToken'] first (e.g. 'Bearer <JWT>')
    auth_header = event.get('authorizationToken')

    # If not present, try headers (case-insensitive)
    if not auth_header:
        headers = event.get('headers', {})
        auth_header = headers.get('Authorization') or headers.get(
            'authorization')

    if not auth_header:
        return None

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None

    return parts[1]


def get_secret():
    secret_name = "kim-jwt-secret"
    region_name = "eu-west-2"

    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager',
                            region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name)
        return get_secret_value_response['SecretString']
    except ClientError as e:
        print(f"Failed to retrieve secret: {e}")
        return None


def generate_policy(principal_id, effect, resources, context=None):
    auth_response = {
        'principalId': principal_id,
        'policyDocument': {
            'Version':
            '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resources
            }]
        }
    }
    if context:
        # context values must be strings
        auth_response['context'] = {k: str(v) for k, v in context.items()}
    return auth_response
