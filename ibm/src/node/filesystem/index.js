var fs = require('fs');
var now = require('performance-now');
var rimraf = require('rimraf');

function main(params) {

    var machine_id = fs.readFileSync('/sys/class/dmi/id/product_uuid', 'utf-8');
    var instance_id = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
    
    var n, size;

    var rnd = Math.floor(Math.random() * 900000) + 100000;

    if(params && params.n) {
        n = params.n;
    } else {
        n = 10000;
    }

    if(params && params.size) {
        size = params.size;
    } else {
        size = 10240;
    }

    var text = '';
    
    for(let i = 0; i<size; i++) {
        text += 'A';
    }
    
    if(!fs.existsSync('/tmp/test')){
      fs.mkdirSync('/tmp/test');
    }

    if(!fs.existsSync('/tmp/test/'+rnd)){
        fs.mkdirSync('/tmp/test/'+rnd);
    }

    let startWrite = now();
    for(let i = 0; i<n; i++) {
        fs.writeFileSync('/tmp/test/'+rnd+'/'+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<n; i++) {
        var test = fs.readFileSync('/tmp/test/'+rnd+'/'+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync('/tmp/test/'+rnd);

    if(fs.existsSync('/tmp/test/'+rnd)){
        rimraf.sync('/tmp/test/'+rnd);
    }

    return {
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
            instanceid: instance_id,
            machineid: machine_id,
            cpu: cpuinfo,
            mem: meminfo,
            uptime: uptime
        }
    };

};

exports.main = main;