import json
import time
import math
import random

def python_matrix(request):

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

    n = 100

    if request.args.get('n') != None:
        n = int(request.args.get('n'))
    else:
        n = 100

    start = time.time()
    result = matrix(n)
    end = time.time()
    elapsed = (end - start)*1000

    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            "test": "matrix test",
            "n": n,
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
