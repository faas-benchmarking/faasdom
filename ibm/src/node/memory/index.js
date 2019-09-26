var fs = require("fs");
  
function main(params) {
    
    var machine_id = fs.readFileSync('/sys/class/dmi/id/product_uuid', 'utf-8');
    var instance_id = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
    
    var text = '';

    for(let i = 0; i<params.n; i++) {
        text += 'A';
    }
    
    return {
        success: true,
        payload: {
            "test": "memory test",
            "n": Number(params.n)
        },
            metrics: {
            instanceid: instance_id,
            machineid: machine_id,
            cpu: cpuinfo,
            mem: meminfo,
            uptime: uptime
        }
      };
}


exports.main = main;