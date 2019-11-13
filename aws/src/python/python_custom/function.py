import json
import time

def my_handler(event, context):
    start = time.time()

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''
    
    end = time.time()
    elapsed = (end - start)*1000
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'success': True,
            'payload': {
                'test': 'custom test',
                'time': elapsed
            }
        })
    }
