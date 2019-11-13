import json
import time

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    start = time.time()

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''

    end = time.time()
    elapsed = (end - start)*1000
    return func.HttpResponse(
        json.dumps({
            'success': True,
            'payload': {
                'test': 'custom test',
                'time': elapsed
            }
        }),
        status_code=200,
        headers={
            'Content-Type': 'application/json'
        }
    )