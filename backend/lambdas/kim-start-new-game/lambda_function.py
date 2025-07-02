import json
import boto3
import uuid
from botocore.exceptions import BotoCoreError, ClientError
import random
import datetime

item_table_name = 'kim-item-table-de37d925-ab2e-48d7-8d5b-162fb30546b0'
game_table_name = 'kim-game-table-92ef119c-a5c1-40f4-b158-e44abbc830ea'

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """
    event
    {
        "player_id": str(uuid),
        "game_type": "recall_all | remove_one",
        "number_of_items": str(number),
        "game_duration": str(10 | 86400)
    }
    """
    player_id = event['player_id']

    if validate_event(event) is False:
        print('Invalid parameters' + str(event))
        return {'statusCode': 500, 'body': json.dumps("Invalid parameters")}

    current_game_exists = exists_current_game(player_id)
    if current_game_exists[0]:
        print(f"Game already exists for player {player_id}")
        return {
            'statusCode':
            409,
            'body':
            json.dumps({
                'game_id': current_game_exists[1],
                'message': "A game already exists for this player.",
                'date_created': current_game_exists[2],
                'game_duration': current_game_exists[3]
            })
        }

    items = []
    ids = set()
    item_count = get_item_count()
    if item_count == 0:
        print('No items in database')
        return {'statusCode': 500, 'body': json.dumps("No items in database")}

    if int(event['number_of_items']) > item_count:
        print(
            'Number of items requested is greater than number of items in database'
        )
        return {
            'statusCode':
            500,
            'body':
            json.dumps(
                "Number of items requested is greater than number of items in database"
            )
        }

    max_attempts = int(event['number_of_items']) * 5
    attempts = 0
    while len(items) < int(
            event['number_of_items']) and attempts < max_attempts:
        try:
            random_id = random.randint(1, item_count)
            if random_id not in ids:
                response = get_item_by_id(random_id)
                if response is not None:
                    items.append(response)
                    ids.add(random_id)
        except Exception as e:
            print(f"Error selecting random item: {e}")
        attempts += 1

    if attempts >= max_attempts:
        print(
            "Failed to randomly select enough unique items within retry limit")
        return {
            'statusCode':
            500,
            'body':
            json.dumps(
                "Failed to randomly select enough unique items within retry limit"
            )
        }

    game_id = new_game_to_database(items, event['game_type'], player_id,
                                   event['game_duration'])
    if game_id is None:
        print("Failed to create new game")
        return {
            'statusCode': 500,
            'body': json.dumps("Failed to create new game")
        }

    print(
        f"New game {game_id} created for player {player_id} with {len(items)} items"
    )

    game = get_game_with_id(game_id)

    if game is None:
        print("Failed to retrieve game")
        return {
            'statusCode': 500,
            'body': json.dumps("Failed to retrieve game")
        }

    return {'statusCode': 200, 'body': json.dumps(game)}


def validate_event(event):
    if 'game_type' not in event:
        return False
    if 'number_of_items' not in event:
        return False
    if 'game_duration' not in event:
        return False
    if event['game_type'] != 'remove_one' and event[
            'game_type'] != 'recall_all':
        return False
    game_duration = int(event['game_duration'])
    if game_duration != 10 and game_duration != 86400:
        return False
    try:
        num_items = int(event['number_of_items'])
        if num_items < 0:
            return False
    except (ValueError, TypeError):
        return False
    return True


def get_item_count():
    try:
        table = dynamodb.Table(item_table_name)
        response = table.get_item(Key={'ID': 'item_counter'})
        return int(response['Item']['count'])
    except KeyError:
        print("The 'item_counter' item or 'count' attribute was not found.")
        return 0
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return 0


def get_item_by_id(id):
    try:
        table = dynamodb.Table(item_table_name)
        response = table.get_item(Key={'ID': str(id)})
        item = response.get('Item')
        if item is None:
            print(f"The item with ID {id} was not found.")
            return None
        if 'ID' not in item:
            print(f"Item with ID {id} is missing 'ID' attribute: {item}")
            return None
        return item
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None


def exists_current_game(player_id):
    try:
        table = dynamodb.Table(game_table_name)
        response = table.query(IndexName='player_id-index',
                               KeyConditionExpression='player_id = :player_id',
                               FilterExpression='current_game = :current_game',
                               ExpressionAttributeValues={
                                   ':player_id': player_id,
                                   ':current_game': True
                               })
        if response['Items']:
            return True, response['Items'][0]['ID'], response['Items'][0][
                'date_created'], response['Items'][0]['game_duration']
        else:
            return False, None
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return True, None


def new_game_to_database(items, game_type, player_id, game_duration):
    try:
        table = dynamodb.Table(game_table_name)
        game_id = str(uuid.uuid4())
        table.put_item(
            Item={
                'ID':
                game_id,
                'player_id':
                player_id,
                'date_created':
                datetime.datetime.now(datetime.timezone.utc).isoformat(),
                'game_duration':
                str(game_duration),
                'current_game':
                True,
                'game_mode':
                'items',
                'game_type':
                game_type,
                'items':
                items
            })
        return game_id
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None


def get_game_with_id(game_id):
    try:
        table = dynamodb.Table(game_table_name)
        response = table.get_item(Key={'ID': game_id})

        item = response.get('Item')
        if item:
            return item
        else:
            return None

    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None
