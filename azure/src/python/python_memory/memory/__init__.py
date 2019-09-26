import logging
import json

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    f=open("/proc/self/cgroup", "r")
    if f.mode == 'r':
        instanceId =f.read()
    f.close()
        
    f=open("/proc/cpuinfo", "r")
    if f.mode == 'r':
        cpuinfo =f.read()
    f.close()
        
    f=open("/proc/meminfo", "r")
    if f.mode == 'r':
        meminfo =f.read()
    f.close()
        
    f=open("/proc/uptime", "r")
    if f.mode == 'r':
        uptime =f.read()
    f.close()

    if req.params.get('n') != None:
        n = int(req.params.get('n'))
    else:
        n = 55

    text = ""
    for i in range(1,n):
        text += 'A'

    return func.HttpResponse(
        json.dumps({
            'success': True,
            'payload': {
                "test": "memory test",
                "n": int(req.params.get('n'))
            },
            'metrics': {
                'machineid': '',
                'instanceid': instanceId,
                'cpu': cpuinfo,
                'mem': meminfo,
                'uptime': uptime
            }
        }),
        status_code=200,
        headers={
            'Content-Type': 'application/json'
        }
    )