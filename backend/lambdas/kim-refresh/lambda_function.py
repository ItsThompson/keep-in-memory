# kim-refresh function

import json
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
import jwt
import time

dynamodb = boto3.resource('dynamodb')
player_table_name = "kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d"
table = dynamodb.Table(player_table_name)


def lambda_handler(event, context):
    '''
    event: {
        "cookie": "string"
    }
    '''
    # inputs: refresh token
    # 1. validate refresh token (check value and expiry)
    # 2. generate new access token
    # outputs: new access token
    print(event)

    # Extract refreshToken from cookie string
    cookie_header = event.get("cookie", "")
    refresh_token = get_refresh_token_from_cookie(cookie_header)
    if not refresh_token:
        return {
            "statusCode": 401,
            "body": json.dumps({"message": "No refresh token found"})
        }

    player_id = validate_refresh_token(refresh_token)
    if player_id is None:
        return {
            "statusCode": 401,
            "body": json.dumps({"message": "Invalid or expired refresh token"})
        }

    token = issue_jwt(player_id)

    if not token:
        return {'statusCode': 500, 'body': json.dumps('Failed to issue token')}

    print("Token issued.")
    return {'statusCode': 200, 'body': json.dumps({'token': token})}


def get_refresh_token_from_cookie(cookie_header):
    refresh_token = None
    for part in cookie_header.split(";"):
        name, _, value = part.strip().partition("=")
        if name == "refreshToken":
            refresh_token = value
            print("refresh_token retrieved from cookie")
            break
    return refresh_token


def validate_refresh_token(refresh_token):
    # 1. existance
    response = None
    try:
        response = table.query(
            IndexName='refresh_token-index',
            KeyConditionExpression=Key('refresh_token').eq(refresh_token))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None
    # 2. expiry
    items = response.get('Items', [])
    if not items:
        print("No matching refresh token found")
        return None

    expiry = items[0].get('refresh_token_expiry', None)
    if expiry is None:
        print("No expiry found")
        return None

    curr_time = int(time.time())
    if curr_time > expiry:
        print("Token expired")
        return None

    player_id = items[0].get('player_id', None)
    if player_id is None:
        print("No player_id found")
        return None
    return player_id


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
