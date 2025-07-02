# kim-user-stats function

import json
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
player_table_name = "kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d"
table = dynamodb.Table(player_table_name)


def lambda_handler(event, context):
    player_id = event['player_id']

    document = get_user_row(player_id)

    if document is None:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }

    return {
        'statusCode':
        200,
        'body':
        json.dumps(
            {
                'total_games_played': document.get("total_games", 0),
                'average_accuracy': document.get("average_accuracy", 0),
                'average_recall': document.get("average_recall", 0),
                'average_precision': document.get("average_precision", 0)
            },
            default=convert_decimal)
    }


def get_user_row(player_id):
    response = None
    try:
        response = table.query(
            IndexName='player_id-index',
            KeyConditionExpression=Key('player_id').eq(player_id))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None
    return response.get('Items')[0] if response.get('Items') else None


def convert_decimal(obj):
    if isinstance(obj, Decimal):
        return float(obj) if obj % 1 else int(obj)
    raise TypeError
