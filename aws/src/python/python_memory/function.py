import json

def my_handler(event, context):
    
    f=open("/proc/self/cgroup", "r")
    if f.mode == 'r':
        insatnceId =f.read()
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

    for i in range(1,int(event['queryStringParameters']['n'])):
        text += 'A'
    
    return {
    'statusCode': 200,
    'headers': {
           'Content-Type': 'application/json'
       },
    'body': json.dumps({
        'payload': 'memory Test',
        'success': True,
        'n': event['queryStringParameters']['n'],
        'instanceId': insatnceId,
        'cpu': cpuinfo,
        'mem': meminfo,
        'uptime': uptime
        })
    }
