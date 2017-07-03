from __future__ import print_function

def lambda_handler(event, context):
	for record in event['Records']:
		print(record['eventID'])
		print(record['eventName'])

	print('Successfully processes %s records.' % str(len(event['Records'])))