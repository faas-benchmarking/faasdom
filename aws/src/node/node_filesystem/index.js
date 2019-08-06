var fs = require("fs");
var now = require('performance-now');

exports.handler = async (event, context, callback) => {
    
    var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
    
    var text = '';
    
    for(let i = 0; i<10240; i++) {
        text += 'A';
    }
    
    let startWrite = now();
    for(let i = 0; i<10000; i++) {
        fs.writeFileSync('/tmp/'+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<10000; i++) {
        var test = fs.readFileSync('/tmp/'+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync('/tmp');
    
    const res = {
        statusCode: 200,
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
            payload: {"test": "filesystem test", "timeWrite(ms)": (endWrite-startWrite).toFixed(3), "timeRead(ms)": (endRead-startRead).toFixed(3)},
            success: files.length == 10000,
            n: files.length,
            id: instanceId,
            cpu: cpuinfo,
            mem: meminfo,
            uptime: uptime
        })
    };
    callback(null, res);
};
