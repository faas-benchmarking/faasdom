import time

def main(request):
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
        'success': True,
        'payload': {
            'test': 'custom test',
            'time': elapsed
        }
    }