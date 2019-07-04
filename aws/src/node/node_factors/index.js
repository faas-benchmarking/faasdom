const now = require('performance-now');
var fs = require("fs");

exports.handler = function(event, context, callback) {

  var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
  var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
  var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  var uptime = fs.readFileSync('/proc/uptime', 'utf-8');

  var res ={
      "statusCode": 200,
      "headers": {
          "Content-Type": "application/json"
      }
  };

  let start = now();
  let n = 2688834647444046;
  let result = factors(n);
  let end = now();
  
  res.body = JSON.stringify({
    payload: { 'n': n, 'result': result, 'time(ms)': (end-start).toFixed(3) },
    id: instanceId,
    cpu: cpuinfo,
    mem: meminfo,
    uptime: uptime
  });
  callback(null, res);
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
