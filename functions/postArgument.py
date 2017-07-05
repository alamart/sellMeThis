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
    
    newArgument = {
                'Keyworduuid': event['Keyword_id'],
                'ArgumentTimestamp' : int(time.time()),
                'Text': event['Text'],
                'Up': 0,
                'Down': 0,
                'PostedBy': 'Test ALVIN'
            }

    table.put_item(
        Item= newArgument
    )
    

    
   