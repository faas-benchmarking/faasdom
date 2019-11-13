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

    var rnd = Math.floor(Math.random() * 900000) + 100000;

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
    var fullPath = '';

    if(fs.existsSync('/tmp')) {
        path = '/tmp/test/';
        fullPath = '/tmp/test/' + rnd + '/';
    } else {
        path = 'D:\\local\\Temp\\test\\';
        fullPath = 'D:\\local\\Temp\\test\\' + rnd + '\\';
    }

    if(!fs.existsSync(path)){
      fs.mkdirSync(path);
    }

    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath);
    }
    
    let startWrite = now();
    for(let i = 0; i<n; i++) {
        fs.writeFileSync(fullPath+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<n; i++) {
        var test = fs.readFileSync(fullPath+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync(fullPath);

    if(fs.existsSync(fullPath)){
        rimraf.sync(fullPath);
    }

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
                "size": Number(size),
                "timewrite": (endWrite-startWrite).toFixed(3),
                "timeread": (endRead-startRead).toFixed(3),
                "time": ((endWrite-startWrite)+(endRead-startRead)).toFixed(3)
            },
            metrics: {
                machineid: '',
                instanceid: instanceId,
                cpu: cpuinfo,
                mem: meminfo,
                uptime: uptime
            }
        })
    };
};
