import logging
#import os

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    instanceId = '""' #os.environ['WEBSITE_INSTANCE_ID']

    if req.params.get('n') != None:
        n = int(req.params.get('n'))
    else:
        n = 55

    text = ""
    for i in range(1,n):
        text += 'A'

    return func.HttpResponse('{"payload": memory test, "success": true, n":' + str(n) + ',"instanceId": ' + instanceId + ',"cpu": "", "mem": "", "uptime": ""}')