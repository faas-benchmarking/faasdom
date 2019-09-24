import json

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:

    return func.HttpResponse(
        json.dumps({
            'success': True,
            'payload': {
                "test": "latency test"
            }
        }),
        status_code=200,
        headers={
            'Content-Type': 'application/json'
        }
    )