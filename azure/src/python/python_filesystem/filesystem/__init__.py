import logging
import json
import time
import os

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:

    if not os.path.exists("/tmp/test"):
        os.makedirs("/tmp/test")

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

    return func.HttpResponse('{"payload": {"test": "filesystem test", "timeWrite(ms)": ' + str((endWrite-startWrite)*1000) + ', "timeRead(ms)": ' + str((endRead-startRead)*1000) +'}, "success": ' + str(len(files) == 10000) + ', n":' + str(len(files)) + ',"instanceId": ' + instanceId + ',"cpu": ' + cpuinfo + ', "mem": ' + meminfo + ', "uptime": ' + uptime + '}')