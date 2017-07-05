from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    # Get the service resource.
    dynamodb = boto3.resource('dynamodb')
    
    # Instantiate a table resource object without actually
    # creating a DynamoDB table. Note that the attributes of this table
    # are lazy-loaded: a request is not made nor are the attribute
    # values populated until the attributes
    # on the table resource are accessed or its load() method is called.
    table = dynamodb.Table('SMT_arguments')
    
    # Print out some data about the table.
    # This will cause a request to be made to DynamoDB and its attribute
    # values will be set based on the response.
    #print(table)
    
    response = table.scan(Limit=100)
    return response['Items']