const now = require('performance-now');
const fs = require('fs');

exports.handler = function(event, context, callback) {

  var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
  var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
  var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  var uptime = fs.readFileSync('/proc/uptime', 'utf-8');

  var n;

  if(event.queryStringParameters && event.queryStringParameters.n) {
      n = event.queryStringParameters.n;
  } else {
      n = 100;
  }

  let start = now();
  let result = matrix(n);
  let end = now();

  const res = {
    statusCode: 200,
    headers: {
       'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        success: true,
        payload: {
            'test': 'matrix test',
            'n': Number(n),
            'time': Number((end-start).toFixed(3))
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
  callback(null, res);
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