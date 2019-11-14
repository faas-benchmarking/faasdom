#!/usr/bin/env python3
import time
import math
import json

def my_handler(event, context):

    f=open('/proc/self/cgroup', 'r')
    if f.mode == 'r':
        instanceId =f.read()
    f.close()
        
    f=open('/proc/cpuinfo', 'r')
    if f.mode == 'r':
        cpuinfo =f.read()
    f.close()
        
    f=open('/proc/meminfo', 'r')
    if f.mode == 'r':
        meminfo =f.read()
    f.close()
        
    f=open('/proc/uptime', 'r')
    if f.mode == 'r':
        uptime =f.read()
    f.close()

    n = 2688834647444046

    if event.get('queryStringParameters') is not None:
        if 'n' in event['queryStringParameters']:
            n = int(event['queryStringParameters']['n'])
    else:
        n = 2688834647444046

    start = time.time()
    result = factors(n)
    end = time.time()
    elapsed = (end - start)*1000

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'success': True,
            'payload': {
                'test': 'cpu test',
                'n': n,
                'result': result,
                'time': elapsed
            },
            'metrics': {
                'machineid': '',
                'instanceid': instanceId,
                'cpu': cpuinfo,
                'mem': meminfo,
                'uptime': uptime
            }
        })
    }

def factors(num):
    n_factors = []

    for i in range(1, math.floor(math.sqrt(num))+1):
        if num % i == 0:
            n_factors.append(i)
            if num / i != i:
                n_factors.append(int(num / i))

    n_factors.sort()

    return n_factors