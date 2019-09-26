const fs = require('fs')

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
    
    var text = '';

    for(let i = 0; i<req.query.n; i++) {
        text += 'A';
    }

    context.res = {
      statusCode: 200,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          success: true,
          payload: {
              "test": "memory test",
              "n": Number(req.query.n)
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