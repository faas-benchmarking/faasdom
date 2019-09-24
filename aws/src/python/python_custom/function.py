import json

def my_handler(event, context):

    # TODO: put your code here
    
    return {
    'statusCode': 200,
    'headers': {
           'Content-Type': 'application/json'
       },
    'body': json.dumps({
        'payload': 'ok'
        })
    }
