const now = require('performance-now');
const fs = require('fs');

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
  
  var n;

  if(req.query && req.query.n) {
      n = req.query.n;
  } else {
      n = 2688834647444046;
  }

  let start = now();
  let result = factors(n);
  let end = now();

  context.res = {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        success: true,
        payload: {
            "test": "cpu test",
            "n": Number(n),
            "result": result,
            "time": Number((end-start).toFixed(3))
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

function factors(num) {
  let n_factors = [];
 
  for (let i = 1; i <= Math.floor(Math.sqrt(num)); i += 1)
    if (num % i === 0) {
      n_factors.push(i);
      if (num / i !== i) {
        n_factors.push(num / i);
      }
    }

  n_factors.sort(function(a, b){return a - b;});

  return n_factors;
}

