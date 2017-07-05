from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import time
import uuid
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('SMT_arguments')

    rate_dir = ''
    if event['Rate'] in ['Up', 'Down']:
        rate_dir = event['Rate']
            
        table.update_item(
            Key={
                'Keyworduuid': event['Keyword_id'],
                'ArgumentTimestamp': event['Timestamp']
            },
            UpdateExpression='SET ' + rate_dir + ' = ' + rate_dir + ' + :val1',
            ExpressionAttributeValues={
                ':val1': 1
            }
        )
        
        response = table.get_item(
            Key={
                'Keyworduuid': event['Keyword_id'],
                'ArgumentTimestamp': event['Timestamp']
            }
        )
        item = response['Item']

        return { 'State' : 'Succes', 'Up' : item['Up'], 'Down' : item['Down'] }

    return { 'State' : 'Error' }

    

    
   