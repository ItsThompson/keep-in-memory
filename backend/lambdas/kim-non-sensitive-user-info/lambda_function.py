# kim-non-sensitive-user-info function

import json
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
player_table_name = "kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d"
table = dynamodb.Table(player_table_name)


def lambda_handler(event, context):
    player_id = event['player_id']

    document = get_user_info(player_id)

    if document is None:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }

    return {
        'statusCode':
        200,
        'body':
        json.dumps({
            'email': document['email'],
            'name': document['name'],
            'picture': document['picture'],
        })
    }


def get_user_info(player_id):
    response = None
    try:
        response = table.query(
            IndexName='player_id-index',
            KeyConditionExpression=Key('player_id').eq(player_id))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None
    return response.get('Items')[0] if response.get('Items') else None
