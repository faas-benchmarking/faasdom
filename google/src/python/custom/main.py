import json
import time

def python_custom(request):
    start = time.time()

    ''' 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    '''
    end = time.time()
    elapsed = (end - start)*1000
    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            'test': 'custom test',
            'time': elapsed
        }
    }), 200, headers)
