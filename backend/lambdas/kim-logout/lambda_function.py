# kim-logout function

import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError

dynamodb = boto3.resource('dynamodb')
player_table_name = "kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d"
table = dynamodb.Table(player_table_name)

ALLOWED_ORIGINS = {
    "https://keep-in-memory.vercel.app", "http://localhost:3000"
}


def lambda_handler(event, context):
    print(event)
    origin = event.get("origin")
    cookie_header = event.get("cookie", "")

    allowed_origin = "null"
    if origin in ALLOWED_ORIGINS:
        allowed_origin = origin

    # Extract refreshToken from cookie string
    refresh_token = None
    for part in cookie_header.split(";"):
        name, _, value = part.strip().partition("=")
        if name == "refreshToken":
            refresh_token = value
            print("refresh_token retrieved from cookie")
            break

    if not refresh_token:
        return {
            "statusCode": 401,
            "body": json.dumps({"message": "No refresh token found"})
        }

    response = None
    try:
        response = table.query(
            IndexName='refresh_token-index',
            KeyConditionExpression=Key('refresh_token').eq(refresh_token))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return {
            "statusCode":
            500,
            "body":
            json.dumps({
                "message": "DynamoDB query failed",
                "error": str(e)
            })
        }

    if response is None:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "DynamoDB query failed"})
        }

    items = response.get('Items', [])
    if not items:
        return {
            "statusCode": 404,
            "body":
            json.dumps({"message": "Refresh token not found in database"})
        }

    print("Player with refresh token found in database")

    sub = items[0].get('sub')

    try:
        table.update_item(
            Key={"sub": sub},
            UpdateExpression="REMOVE refresh_token, refresh_token_expiry")
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return {
            "statusCode": 500,
            "body":
            json.dumps({"message": "An error occurred while logging out"}),
        }

    print("Refresh token removed from database")

    refresh_cookie = ("refreshToken=; "
                      "HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0")

    return {
        "statusCode": 200,
        "headers": {
            "Set-Cookie": refresh_cookie,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowed_origin,
            "Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps({"message": "Logged out successfully"}),
    }


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
