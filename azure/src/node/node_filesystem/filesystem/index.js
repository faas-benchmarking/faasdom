const fs = require("fs");
const now = require('performance-now');
var rimraf = require("rimraf");

module.exports = async function (context, req) {
    
    var cpuinfo = '';
    var instanceId = '';
    var meminfo = '';
    var uptime = '';
  
    if(fs.existsSync('/proc/cpuinfo')) {
      cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    }
  
    if(fs.existsSync('/proc/self/cgroup')) {
      instanceId = fs.readFileSync('/proc/self/cgroup', 'utf8');
    }
  
    if(fs.existsSync('/proc/meminfo')) {
      meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    }
  
    if(fs.existsSync('/proc/uptime')) {
      uptime = fs.readFileSync('/proc/uptime', 'utf8');
    }
    
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

    var path = '';

    if(fs.existsSync('/tmp')) {
        path = '/tmp/test';
    } else {
        path = 'D:\\local\\Temp\\test'
    }

    if(fs.existsSync(path)){
        rimraf.sync(path);
    }

    if(!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
    
    let startWrite = now();
    for(let i = 0; i<n; i++) {
        fs.writeFileSync(path+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<n; i++) {
        var test = fs.readFileSync(path+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync(path);

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
