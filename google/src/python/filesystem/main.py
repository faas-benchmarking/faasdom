import json
import time
import os

def python_filesystem(request):
    
    if not os.path.exists("/tmp/test"):
        os.makedirs("/tmp/test")
        
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
    
    text = ""
    
    for i in range(1, 10240):
        text += "A"
        
    startWrite = time.time()
    for i in range(0,10000):
        filehandle = open('/tmp/test/'+str(i)+'.txt', 'w')
        filehandle.write(text)
        filehandle.close()
    
    endWrite = time.time()
    
    startRead = time.time()
    for i in range(0,10000):
        filehandle = open('/tmp/test/'+str(i)+'.txt', 'r')
        test = filehandle.read()
        filehandle.close()
    
    endRead = time.time()
    
    files = os.listdir("/tmp/test")
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'payload': {"test": "filesystem test", "timeWrite(ms)": (endWrite-startWrite)*1000, "timeRead(ms)": (endRead-startRead)*1000},
        'success': len(files) == 10000,
        'n': len(files),
        'cpu': cpuinfo,
        'mem': meminfo,
        'uptime': uptime
        }), 200, headers)