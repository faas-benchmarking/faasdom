import json

def python_custom(request):

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''

    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            "test": "custom test"
        }
    }), 200, headers)
