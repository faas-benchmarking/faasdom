import json
import time
import math

def python_factors(request):

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

    if request.args.get('n') != None:
        n = int(request.args.get('n'))
    else:
        n = 2688834647444046

    start = time.time()
    result = factors(n)
    end = time.time()
    elapsed = (end - start)*1000

    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            "test": "cpu test",
            "n": n,
            "result": result,
            "time": elapsed
        },
        'metrics': {
            'machineid': '',
            'instanceid': '',
            'cpu': cpuinfo,
            'mem': meminfo,
            'uptime': uptime
        }
    }), 200, headers)

def factors(num):
    n_factors = []

    for i in range(1, math.floor(math.sqrt(num))+1):
        if num % i == 0:
            n_factors.append(i)
            if num / i != i:
                n_factors.append(int(num / i))

    n_factors.sort()

    return n_factors