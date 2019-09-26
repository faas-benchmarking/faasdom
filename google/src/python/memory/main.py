import json

def python_memory(request):
        
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

    for i in range(1,int(request.args.get('n'))):
        text += 'A'
        
    headers = {
        'Content-Type': 'application/json'
    }
    
    return (json.dumps({
        'success': True,
        'payload': {
            "test": "memory test",
            "n": int(request.args.get('n'))
        },
        'metrics': {
            'machineid': '',
            'instanceid': '',
            'cpu': cpuinfo,
            'mem': meminfo,
            'uptime': uptime
        }
    }), 200, headers)