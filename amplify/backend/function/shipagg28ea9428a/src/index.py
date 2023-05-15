import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
import decimal

TABLE_NAME = 'ship_scrapings'

def handler(event, context):

    http_method = event['httpMethod']
    if http_method == 'GET':
        response = handle_get_request(event)
    else:
        response = {'statusCode': 400, 'body': 'Invalid HTTP method'}
    return response

def handle_get_request(event):
    # Get the organization id from the request
    group = get_user_group(event)
    org_id = group
    # Get item from DynamoDB table
    start_date = event['queryStringParameters']['start_date']
    end_date = event['queryStringParameters']['end_date']
    results = query_shipments_by_dates(TABLE_NAME, org_id, start_date, end_date)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': json.dumps(results)}

def convert_decimals(items):
    for item in items:
        for key in item:
            if isinstance(item[key], decimal.Decimal):
                item[key] = int(item[key])
    return items

def separate_items_by_type(items):
    ship_items = []
    item_items = []

    for item in items:
        if "SHIP" in item['SK'].split("#")[0]:
            ship_items.append(item)
        elif "ITEM" in item['SK'].split("#")[0]:
            item_items.append(item)

    return ship_items, item_items

def query_shipments_by_dates(table_name, org_id, start_date, end_date):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    # print start and end dates
    print(f"Querying on: ORG#{org_id} Start date: {start_date} End date: {end_date}")

    try:
        response = table.query(
            KeyConditionExpression= Key('GSI1PK').eq(f"ORG#{org_id}") & Key("GSI1SK").between(start_date, end_date),
            IndexName='GSI1',
        )
    except ClientError as e:
        print(f'ErrorCode: {e.response["Error"]["Code"]} Message: {e.response["Error"]["Message"]}')

    # extract items from response
    table_items = response['Items']

    table_items = convert_decimals(table_items)
    #print(f"Items(converted): {items}")
    # separate items by type
    shipments, items = separate_items_by_type(table_items)

    # Iterate over the shipments and get the items for each shipment based on the 'shipment_id' attribute in the item. 
    # Add each related item to a new 'imtes' attribute in the shipment
    for shipment in shipments:
        shipment["id"] = shipment["SK"]
        shipment['items'] = []
        for item in items:
            if shipment['SK'] == item['shipment_id']:
                shipment['items'].append(item)
    
    # print shipments
    print(f"Shipments: {shipments}")

    return shipments

# Get the AWS Cognito groups for the requesting user
def get_user_group(event):
    try:
        group = event['requestContext']['authorizer']['claims']['cognito:groups']
    except KeyError:
        group = ""

    return group