import json

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''

    return func.HttpResponse(
        json.dumps({
            'success': True,
            'payload': {
                "test": "custom test"
            }
        }),
        status_code=200,
        headers={
            'Content-Type': 'application/json'
        }
    )