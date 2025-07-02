# kim-on-item-upload

import json
import urllib.parse
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError

dynamodb_table_name = 'kim-item-table-de37d925-ab2e-48d7-8d5b-162fb30546b0'


def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'],
                                    encoding='utf-8')

    try:
        file_name_wo_extension = key.split('.')[0]
        object_url = 'https://{}.s3.amazonaws.com/{}'.format(bucket, key)
        if object_in_item_table(object_url):
            return {
                'statusCode':
                409,
                'body':
                json.dumps('Object {} already exists in DynamoDB'.format(
                    file_name_wo_extension))
            }
        add_to_dynamodb(object_url, file_name_wo_extension)

        return {
            'statusCode':
            200,
            'body':
            json.dumps('Successfully added {} to DynamoDB'.format(
                file_name_wo_extension))
        }
    except Exception as e:
        print(e)
        print(
            'Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'
            .format(key, bucket))
        raise e


def object_in_item_table(object_url):
    response = None
    try:
        table = boto3.resource('dynamodb').Table(dynamodb_table_name)
        response = table.query(
            IndexName='object_url-index',
            KeyConditionExpression=Key('object_url').eq(object_url))
    except (BotoCoreError, ClientError) as e:
        print(f"An error occurred while accessing DynamoDB: {e}")
        return False

    items = response.get('Items', [])
    if not items:
        print("Object not found")
        return False
    return True


def add_to_dynamodb(object_url, file_name_wo_extension):
    table = boto3.resource('dynamodb').Table(dynamodb_table_name)

    # Add one to the counter and ask for the new value to be returned
    response = table.update_item(Key={'ID': 'item_counter'},
                                 UpdateExpression="ADD #cnt :val",
                                 ExpressionAttributeNames={'#cnt': 'count'},
                                 ExpressionAttributeValues={':val': 1},
                                 ReturnValues="UPDATED_NEW")

    # Retrieve the new value
    nextItemId = response['Attributes']['count']

    # Use the new value
    table.put_item(
        Item={
            'ID': str(nextItemId),
            'object_url': str(object_url),
            'names': [file_name_wo_extension]
        })
