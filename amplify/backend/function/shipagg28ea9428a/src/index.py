import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'ship_scrapings'
table = dynamodb.Table(table_name)

def handler(event, context):

    http_method = event['httpMethod']
    if http_method == 'GET':
        response = handle_get_request(event)
    elif http_method == 'POST':
        response = handle_post_request(event)
    elif http_method == 'PATCH':
        response = handle_patch_request(event)
    elif http_method == 'PUT':
        response = handle_put_request(event)
    elif http_method == 'DELETE':
        response = handle_delete_request(event)
    else:
        response = {'statusCode': 400, 'body': 'Invalid HTTP method'}
    return response

def handle_get_request(event):
    # Get item from DynamoDB table
    item_id = event['queryStringParameters']['id']
    response = table.get_item(Key={'id': item_id})
    return {'statusCode': 200, 'body': json.dumps(response['Item'])}

def handle_post_request(event):
    # Add item to DynamoDB table
    item = json.loads(event['body'])
    table.put_item(Item=item)
    return {'statusCode': 200, 'body': 'Item added successfully'}

def handle_patch_request(event):
    # Update item in DynamoDB table
    item_id = event['queryStringParameters']['id']
    item = json.loads(event['body'])
    update_expression = 'SET ' + ', '.join(f'#{k} = :{k}' for k in item.keys())
    expression_attribute_names = {f'#{k}': k for k in item.keys()}
    expression_attribute_values = {f':{k}': v for k, v in item.items()}
    table.update_item(
        Key={'id': item_id},
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
    )
    return {'statusCode': 200, 'body': 'Item updated successfully'}

def handle_put_request(event):
    # Replace item in DynamoDB table
    item = json.loads(event['body'])
    table.put_item(Item=item)
    return {'statusCode': 200, 'body': 'Item replaced successfully'}

def handle_delete_request(event):
    # Delete item from DynamoDB table
    item_id = event['queryStringParameters']['id']
    table.delete_item(Key={'id': item_id})
    return {'statusCode': 200, 'body': 'Item deleted successfully'}

'''
import boto3
import json

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('your-table-name-here')

# Handler function for Lambda
def lambda_handler(event, context):
    http_method = event['httpMethod']
    path_params = event['pathParameters']
    query_params = event['queryStringParameters']
    body_params = json.loads(event['body']) if event['body'] else None
    
    if http_method == 'GET':
        if path_params:
            if 'id' in path_params:
                item_id = path_params['id']
                response = table.get_item(Key={'PK': f'SHIPMENT#{item_id}', 'SK': f'SHIPMENT#{item_id}'})
                item = response.get('Item')
                return {
                    'statusCode': 200,
                    'body': json.dumps(item)
                }
            elif 'code' in path_params:
                code = path_params['code']
                response = table.get_item(Key={'PK': f'CARRIER#{code}', 'SK': f'CARRIER#{code}'})
                item = response.get('Item')
                return {
                    'statusCode': 200,
                    'body': json.dumps(item)
                }
            elif 'name' in path_params:
                name = path_params['name']
                response = table.get_item(Key={'PK': f'SHIPMENT_STATUS#{name}', 'SK': f'SHIPMENT_STATUS#{name}'})
                item = response.get('Item')
                return {
                    'statusCode': 200,
                    'body': json.dumps(item)
                }
        else:
            response = table.scan()
            items = response.get('Items')
            return {
                'statusCode': 200,
                'body': json.dumps(items)
            }
    elif http_method == 'POST':
        if 'id' in path_params and body_params:
            item_id = path_params['id']
            item_data = body_params['data']
            table.put_item(Item={'PK': f'SHIPMENT#{item_id}', 'SK': f'SHIPMENT#{item_id}', 'data': item_data})
            return {
                'statusCode': 201,
                'body': json.dumps({'message': 'Item created successfully.'})
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid request.'})
            }
    elif http_method == 'PUT' or http_method == 'PATCH':
        if 'id' in path_params and body_params:
            item_id = path_params['id']
            item_data = body_params['data']
            table.update_item(
                Key={'PK': f'SHIPMENT#{item_id}', 'SK': f'SHIPMENT#{item_id}'},
                UpdateExpression='SET #data = :data',
                ExpressionAttributeNames={'#data': 'data'},
                ExpressionAttributeValues={':data': item_data}
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Item updated successfully.'})
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid request.'})
            }
    elif http_method == 'DELETE':
        if 'id' in path_params:
            item_id = path_params['id']
            table.delete_item(Key={'PK': f'SHIPMENT#{item_id}', 'SK': f'SHIPMENT#{item_id}'})
            return {
'''