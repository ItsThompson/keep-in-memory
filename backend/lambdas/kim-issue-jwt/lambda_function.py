# kim-issue-jwt function

import json
from google.oauth2 import id_token
from google.auth.transport import requests
import boto3
from botocore.exceptions import BotoCoreError, ClientError
import uuid
import jwt
import time

dynamodb = boto3.resource('dynamodb')
player_table_name = "kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d"
table = dynamodb.Table(player_table_name)

GOOGLE_CLIENT_ID = "632612463395-3v3am34m4icrmo7gk136uaokk4gk3ot1.apps.googleusercontent.com"

ALLOWED_ORIGINS = {
    "https://keep-in-memory.vercel.app",
    "http://localhost:3000"  # remove for prod
}


def lambda_handler(event, context):
    '''
    event: {
        "origin": "string"
        "token": "string"
    }
    '''
    print(event)
    google_token = event.get("token")
    if google_token is None:
        return {'statusCode': 400, 'body': json.dumps('No token provided')}
    user_info = verify_google_token(google_token)
    if user_info is None:
        return {'statusCode': 400, 'body': json.dumps('Invalid token')}

    refresh_token = str(uuid.uuid4())
    # FUTURE: encrypting refresh_token in database
    refresh_cookie = (
        f"refreshToken={refresh_token}; "
        f"HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800")

    player_data = player_exists(user_info["sub"])
    player_id = None
    refresh_token_expiry = int(time.time()) + 604800
    if player_data[0]:
        player_id = player_data[1]['player_id']
        table.update_item(
            Key={'sub': user_info["sub"]},
            UpdateExpression=
            "SET refresh_token = :rt, refresh_token_expiry = :rte",
            ExpressionAttributeValues={
                ':rt': refresh_token,
                ':rte': refresh_token_expiry
            })
    else:
        player_id = str(uuid.uuid4())
        table.put_item(
            Item={
                'player_id': player_id,
                'sub': user_info["sub"],
                'email': user_info["email"],
                'name': user_info["name"],
                'picture': user_info["picture"],
                'refresh_token': refresh_token,
                'refresh_token_expiry': refresh_token_expiry
            })

    token = issue_jwt(player_id)

    if not token:
        return {'statusCode': 500, 'body': json.dumps('Failed to issue token')}

    origin = event.get('origin')

    allowed_origin = "null"
    if origin in ALLOWED_ORIGINS:
        allowed_origin = origin

    print("Token issued.")
    print("Refresh Cookie", refresh_cookie)
    return {
        'statusCode': 200,
        'headers': {
            "Set-Cookie": refresh_cookie,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowed_origin,
            "Access-Control-Allow-Credentials": "true"
        },
        'body': json.dumps({'token': token})
    }


def verify_google_token(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(),
                                              GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account info:
        email = idinfo['email']
        sub = idinfo['sub']  # Google's unique user ID
        name = idinfo.get('name')
        picture = idinfo.get('picture')

        return {"email": email, "sub": sub, "name": name, "picture": picture}

    except ValueError:
        # Invalid token
        print("Invalid token")
        return None


def player_exists(sub):
    try:
        response = table.get_item(Key={'sub': sub})
        if 'Item' in response:
            return True, response['Item']
            # Player exists
        else:
            return False, None
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False, None


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
        return None  # or raise e, depending on how you want to handle failure


def issue_jwt(player_id):
    try:
        expires_in = 900
        now = int(time.time())
        payload = {
            "player_id": player_id,
            "iat": now,  # issued at
            "exp": now + expires_in,  # expiry time
        }
        secret = get_secret()
        if not secret:
            raise Exception("JWT secret is missing")

        token = jwt.encode(payload, secret, algorithm="HS256")

        if isinstance(token, bytes):
            token = token.decode('utf-8')

        return token
    except Exception as e:
        print(f"Failed to generate JWT: {e}")
        return None
