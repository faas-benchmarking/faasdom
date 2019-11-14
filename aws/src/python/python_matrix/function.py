#!/usr/bin/env python3
import time
import math
import random
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

    n = 100

    if event.get('queryStringParameters') is not None:
        if 'n' in event['queryStringParameters']:
            n = int(event['queryStringParameters']['n'])
    else:
        n = 100

    start = time.time()
    result = matrix(n)
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
                'test': 'matrix test',
                'n': n,
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

def randomTable(n):
    return [[math.floor(random.random()*100) for i in range(n)] for j in range(n)]

def matrix(n):
    matrixA = randomTable(n)
    matrixB = randomTable(n)
    matrixMult = [[0 for i in range(n)] for j in range(n)]
 
    for i in range(0,len(matrixA)):
        for j in range(0,len(matrixB)):
            sum = 0
            for k in range(0,len(matrixA)):
                sum += matrixA[i][k] * matrixB[k][j]
            matrixMult[i][j] = sum

    return matrixMult