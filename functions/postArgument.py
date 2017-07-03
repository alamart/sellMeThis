from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import time
import uuid
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('SMT_keywords')
    
    response = table.get_item(
        Key={
            'UUID': event['Keyword_id'],
            'KeywordTimestamp' : int(event['KeywordTimestamp'])
        }
    )
    
    oldItem = response['Item']
    arguments = oldItem.setdefault('Arguments', [])
    
    newArgument = {
                'UUID': str(uuid.uuid1()),
                'ArgumentTimestamp' : int(time.time()),
                'Text': event['Text'],
                'Up': 0,
                'Down': 0
            }
    
    arguments.append(newArgument)
    
    table.update_item(
        Key={
            'UUID': oldItem['UUID'],
            'KeywordTimestamp' : int(oldItem['KeywordTimestamp'])
        },
        UpdateExpression='SET Arguments = :val1',
        ExpressionAttributeValues={
            ':val1': arguments
        }
    )
    
   