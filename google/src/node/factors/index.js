const now = require('performance-now');
const fs = require('fs');

exports.node_factors = (req, res) => {

  var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
  var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
  var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  var uptime = fs.readFileSync('/proc/uptime', 'utf-8');

  var n;

    if(req.query && req.query.n) {
        n = req.query.n;
    } else {
        n = 2688834647444046;
    }

  let start = now();
  let result = factors(n);
  let end = now();

  res.set("Content-Type", "application/json");
	res.status(200);
  res.send(JSON.stringify({
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
  }));

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
