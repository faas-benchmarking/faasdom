import time
import math
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

    n = 2688834647444046

    if req.params.get('n') != None:
        n = int(req.params.get('n'))
    else:
        n = 2688834647444046

    start = time.time()
    result = factors(n)
    end = time.time()
    elapsed = (end - start)*1000

    return func.HttpResponse(
        json.dumps({
            'success': True,
            'payload': {
                "test": "cpu test",
                "n": n,
                "result": result,
                "time": (end-start)*1000
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

def factors(num):
    n_factors = []

    for i in range(1, math.floor(math.sqrt(num))+1):
        if num % i == 0:
            n_factors.append(i)
            if num / i != i:
                n_factors.append(int(num / i))

    n_factors.sort()

    return n_factors
