import json
import boto3
from botocore.exceptions import BotoCoreError, ClientError

dynamodb = boto3.resource('dynamodb')
game_table_name = 'kim-game-table-92ef119c-a5c1-40f4-b158-e44abbc830ea'
table = dynamodb.Table(game_table_name)


def lambda_handler(event, context):
    player_id = event['player_id']

    current_game_exists = exists_current_game(player_id)

    if not current_game_exists[0]:
        print(f"No current game for player {player_id}")
        return {'statusCode': 400, 'body': json.dumps('No current game')}

    current_game = current_game_exists[1]
    print(f"Current game for player {player_id} found: {current_game['ID']}")

    return {'statusCode': 200, 'body': json.dumps(current_game)}


def exists_current_game(player_id):
    try:
        response = table.query(IndexName='player_id-index',
                               KeyConditionExpression='player_id = :player_id',
                               FilterExpression='current_game = :current_game',
                               ExpressionAttributeValues={
                                   ':player_id': player_id,
                                   ':current_game': True
                               })
        if response['Items']:
            return True, response['Items'][0]
        else:
            return False, None
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False, None
