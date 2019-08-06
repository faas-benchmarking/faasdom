const fs = require('fs');
const now = require('performance-now');

function main(params) {

    var machine_id = fs.readFileSync('/sys/class/dmi/id/product_uuid', 'utf-8');
    var instance_id = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
    
    var text = '';
    
    for(let i = 0; i<10240; i++) {
        text += 'A';
    }
    
    if(!fs.existsSync('/tmp/test')){
      fs.mkdirSync('/tmp/test');
    }

    let startWrite = now();
    for(let i = 0; i<10000; i++) {
        fs.writeFileSync('/tmp/test/'+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<10000; i++) {
        var test = fs.readFileSync('/tmp/test/'+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync('/tmp/test');

    return {
        payload: {"test": "filesystem test", "timeWrite(ms)": (endWrite-startWrite).toFixed(3), "timeRead(ms)": (endRead-startRead).toFixed(3)},
        success: files.length == 10000,
        n: files.length,
        instance_id: instance_id,
        machine_id: machine_id,
        cpu: cpuinfo,
        mem: meminfo,
        uptime: uptime
    };

};

exports.main = main;