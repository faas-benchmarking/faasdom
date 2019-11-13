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
      n = 100;
  }

  let start = now();
  let result = matrix(n);
  let end = now();

  context.res = {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        success: true,
        payload: {
            "test": "matrix test",
            "n": Number(n),
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

const randomTable = (size) => Array.from(
  {length: size}, 
  () => Array.from({length: size}, () => Math.floor(Math.random() * 100))
)

function matrix(n) {
  let matrixA = randomTable(n);
  let matrixB = randomTable(n);
  let matrixMult = [];
 
  for (var i = 0; i < matrixA.length; i++) {
    matrixMult[i] = [];
    for (var j = 0; j < matrixB.length; j++) {
      var sum = 0;
      for (var k = 0; k < matrixA.length; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      matrixMult[i][j] = sum;
    }
  }

  return matrixMult;
}