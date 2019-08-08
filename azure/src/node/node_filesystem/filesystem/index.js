const fs = require("fs");
const now = require('performance-now');
var rimraf = require("rimraf");

module.exports = async function (context, req) {
    
    var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
    
    var n, size;

    if(req.query && req.query.n) {
        n = req.query.n;
    } else {
        n = 10000;
    }

    if(req.query && req.query.size) {
        size = req.query.size;
    } else {
        size = 10240;
    }

    var text = '';
    
    for(let i = 0; i<size; i++) {
        text += 'A';
    }

    if(fs.existsSync('/tmp/test')){
        rimraf.sync('/tmp/test');
    }

    if(!fs.existsSync('/tmp/test')){
      fs.mkdirSync('/tmp/test');
    }
    
    let startWrite = now();
    for(let i = 0; i<n; i++) {
        fs.writeFileSync('/tmp/test/'+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<n; i++) {
        var test = fs.readFileSync('/tmp/test/'+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync('/tmp/test');

    context.res = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            success: files.length == n,
            payload: {
                "test": "filesystem test",
                "n": files.length,
                "size": size,
                "timeWrite(ms)": (endWrite-startWrite).toFixed(3),
                "timeRead(ms)": (endRead-startRead).toFixed(3)
            },
            metrics: {
                machineId: '',
                id: instanceId,
                cpu: cpuinfo,
                mem: meminfo,
                uptime: uptime
            }
        })
    };
};
