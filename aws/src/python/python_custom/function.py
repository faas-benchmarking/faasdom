import json

def my_handler(event, context):

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'success': True,
            'payload': {
                'test': 'custom test'
            }
        })
    }
