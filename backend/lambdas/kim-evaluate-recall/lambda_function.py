import json
import re
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
game_table_name = 'kim-game-table-92ef119c-a5c1-40f4-b158-e44abbc830ea'
player_table_name = 'kim-player-table-ff236eda-7ee6-4584-bc4f-f1b16c02278d'


def lambda_handler(event, context):
    '''
    event
    {
        "recall_list": ["bell", "bicycle", "cable car", "car", "car seat", "envelope", "flag", "pencil", "sailboat", "tennis ball", "trash", "trophy"]
    }
    '''
    player_id = event['player_id']

    if validate_event(event) is False:
        print('Invalid parameters' + str(event))
        return {'statusCode': 500, 'body': json.dumps("Invalid parameters")}

    current_game_exists = exists_current_game(player_id)

    if not current_game_exists[0]:
        print(f"No current game for player {player_id}")
        return {'statusCode': 400, 'body': json.dumps('No current game')}

    game_id = current_game_exists[1]
    items = current_game_exists[2]
    item_names = [
    ]  # 2d array where each row represents names for a particular item

    for item_obj in items:
        item_obj_names = item_obj.get('names', None)
        if item_obj_names is None:
            continue
        item_names.append(item_obj_names)

    recall_list = set(sanitize(event['recall_list']))

    result = classify_names(
        item_names, recall_list
    )  # Array of dictionaries({name: <str>, classification: <true_positive|false_positive|false_negative>})

    success = add_recall_results_and_end_game(game_id, result)

    if not success:
        return {
            'statusCode': 500,
            'body': json.dumps('Error adding recall results')
        }

    success = update_player_stats(player_id, result)

    if not success:
        return {
            'statusCode': 500,
            'body': json.dumps('Error updating user stats')
        }

    return {
        'statusCode': 200,
        'body': json.dumps({
            'game_id': game_id,
            'recall_results': result
        })
    }


def validate_event(event):
    '''
    Validates the event by checking if the required keys are present
    and if the recall_list is a list.
    '''
    if 'recall_list' not in event:
        return False
    if not isinstance(event.get('recall_list'), list):
        return False
    return True


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
                'items']
        else:
            return False, None, None
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False, None, None


def sanitize(recall_list):
    '''
    Sanitizes the recall list by removing spaces, converting to lowercase,
    and keeping only alphabet characters.
    '''
    sanitized_recall_list = []
    for item in recall_list:
        cleaned = re.sub(r'[^a-z]', '', item.lower())
        sanitized_recall_list.append(cleaned)
    return sanitized_recall_list


def classify_names(item_names, recall_list):
    """
    Classify each name in recall_list as true_positive, false_positive, or false_negative.
    Args:
        item_names: 2D list where each row represents all possible names for a single ground-truth item
        recall_list: Flat list of predicted labels (unique names)
    Returns:
        List of dictionaries with name and classification
    """
    # Create a mapping from name to row indices
    name_to_rows = {}
    for row_idx, row in enumerate(item_names):
        for name in row:
            if name not in name_to_rows:
                name_to_rows[name] = []
            name_to_rows[name].append(row_idx)

    # Track which rows have been claimed
    claimed_rows = set()

    # Lists to store results in order
    true_positives = []
    false_positives = []

    # Process each name in recall_list
    for name in recall_list:
        if name in name_to_rows:
            # Find if any of the rows this name maps to are unclaimed
            found_unclaimed = False
            for row_idx in name_to_rows[name]:
                if row_idx not in claimed_rows:
                    # This is a true positive - claim the row
                    claimed_rows.add(row_idx)
                    true_positives.append({
                        "name": name,
                        "classification": "true_positive"
                    })
                    found_unclaimed = True
                    break

            if not found_unclaimed:
                # All rows this name maps to are already claimed
                false_positives.append({
                    "name": name,
                    "classification": "false_positive"
                })
        else:
            # Name doesn't match any row
            false_positives.append({
                "name": name,
                "classification": "false_positive"
            })

    # Find false negatives (unclaimed rows)
    false_negatives = []
    for row_idx, row in enumerate(item_names):
        if row_idx not in claimed_rows:
            # Use the first name from the unclaimed row
            first_name = row[0]
            false_negatives.append({
                "name": first_name,
                "classification": "false_negative"
            })

    # Return in the specified order: true_positives, false_negatives, false_positives
    return true_positives + false_negatives + false_positives


def add_recall_results_and_end_game(game_id, recall_results):
    try:
        table = dynamodb.Table(game_table_name)

        update_expr_parts = [
            '#recall = :recall_val', '#current = :current_val'
        ]
        expr_attr_names = {
            '#recall': 'recall_results',
            '#current': 'current_game'
        }
        expr_attr_values = {
            ':recall_val': recall_results,
            ':current_val': False
        }

        update_expression = 'SET ' + ', '.join(update_expr_parts)

        table.update_item(
            Key={'ID': game_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values,
        )

        return True
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False


def update_player_stats(player_id, recall_results):
    # 0. Calculate accuracy, recall and precision from results.
    tp, fp, fn = 0, 0, 0
    for result in recall_results:
        if result['classification'] == 'true_positive':
            tp += 1
        elif result['classification'] == 'false_positive':
            fp += 1
        elif result['classification'] == 'false_negative':
            fn += 1
    accuracy = round(tp / (tp + fp + fn), 2) if (tp + fp + fn) > 0 else 0
    recall = round(tp / (tp + fn), 2) if (tp + fn) > 0 else 0
    precision = round(tp / (tp + fp), 2) if (tp + fp) > 0 else 0

    document = get_user_stats(player_id)

    if document is None:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }
    # 1. total_games <- "total games" for player_id in database
    total_games = document.get('total_games', 0)
    # 2. prev_avg_acc <- "average_accuracy" for player_id in database
    prev_avg_acc = document.get('average_accuracy', 0)
    # 3. prev_avg_recall <- "average_recall" for player_id in database
    prev_avg_recall = document.get('average_recall', 0)
    # 4. prev_avg_precision <- "average_precision" for player_id in database
    prev_avg_precision = document.get('average_precision', 0)

    total_games = int(total_games)
    prev_avg_acc = float(prev_avg_acc)
    prev_avg_recall = float(prev_avg_recall)
    prev_avg_precision = float(prev_avg_precision)

    # 5. new_avg = ((prev_avg_acc * total_games) + accuracy)/(total_games + 1)
    new_avg = ((prev_avg_acc * total_games) + accuracy) / (total_games + 1)
    # 6. new_recall = ((prev_avg_recall * total_games) + recall)/(total_games + 1)
    new_recall = ((prev_avg_recall * total_games) + recall) / (total_games + 1)
    # 7. new_precision = ((prev_avg_precision * total_games) + precision)/(total_games + 1)
    new_precision = (
        (prev_avg_precision * total_games) + precision) / (total_games + 1)
    # 8. Increment "total games" in database
    total_games += 1
    # 9. Update user stats
    return update_user_stats(document["sub"], total_games, new_avg, new_recall,
                             new_precision)


def get_user_stats(player_id):
    table = dynamodb.Table(player_table_name)
    response = None
    try:
        response = table.query(
            IndexName='player_id-index',
            KeyConditionExpression=Key('player_id').eq(player_id))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return None
    return response.get('Items')[0] if response.get('Items') else None


def update_user_stats(sub, total_games, new_avg, new_recall, new_precision):
    table = dynamodb.Table(player_table_name)
    try:
        table.update_item(
            Key={'sub': sub},
            UpdateExpression='SET total_games = :total_games, average_accuracy = :new_avg, average_recall = :new_recall, average_precision = :new_precision',
            ExpressionAttributeValues={
                ':total_games': int(total_games),
                ':new_avg': Decimal(str(new_avg)),
                ':new_recall': Decimal(str(new_recall)),
                ':new_precision': Decimal(str(new_precision)),
            })
        return True
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False
