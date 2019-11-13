import json
import time
import os
import shutil
import random

def python_filesystem(request):

    rnd = random.randint(100000,999999)
    
    if os.path.exists("/tmp/test"):
        shutil.rmtree("/tmp/test")

    if not os.path.exists("/tmp/test/"+str(rnd)):
        os.makedirs("/tmp/test/"+str(rnd))
        
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

    if request.args.get('n') != None:
        n = int(request.args.get('n'))
    else:
        n = 10000

    if request.args.get('size') != None:
        size = int(request.args.get('size'))
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
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
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
            'instanceid': '',
            'cpu': cpuinfo,
            'mem': meminfo,
            'uptime': uptime
        }
    }), 200, headers)