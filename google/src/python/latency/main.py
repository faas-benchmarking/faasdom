import json

def python_latency(request):

    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            "test": "latency test"
        }
    }), 200, headers)