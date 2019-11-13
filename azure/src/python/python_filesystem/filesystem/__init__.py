import logging
import json
import time
import os
import shutil
import random

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:

    rnd = random.randint(100000,999999)

    if os.path.exists("/tmp/test"):
        shutil.rmtree("/tmp/test")

    if not os.path.exists("/tmp/test/"+str(rnd)):
        os.makedirs("/tmp/test/"+str(rnd))

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
    
    n, size = 10000, 10240

    if req.params.get('n') != None:
        n = int(req.params.get('n'))
    else:
        n = 10000

    if req.params.get('size') != None:
        size = int(req.params.get('size'))
    else:
        size = 10240

    text = ""
    
    for i in range(1, size):
        text += "A"
        
    startWrite = time.time()
    for i in range(0,n):
        filehandle = open('/tmp/test/'+str(rnd)+'/'+str(i)+'.txt', 'w')
        filehandle.write(text)
        filehandle.close()
    
    endWrite = time.time()
    
    startRead = time.time()
    for i in range(0,n):
        filehandle = open('/tmp/test/'+str(rnd)+'/'+str(i)+'.txt', 'r')
        test = filehandle.read()
        filehandle.close()
    
    endRead = time.time()
    
    files = os.listdir("/tmp/test/"+str(rnd))

    if os.path.exists("/tmp/test/"+str(rnd)):
        shutil.rmtree("/tmp/test/"+str(rnd))

    return func.HttpResponse(
        json.dumps({
            'success': len(files) == n,
            'payload': {
                "test": "filesystem test",
                "n": len(files),
                "size": size,
                "timewrite": (endWrite-startWrite)*1000,
                "timeread": (endRead-startRead)*1000,
                "time": ((endWrite-startWrite)*1000)+((endRead-startRead)*1000)
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