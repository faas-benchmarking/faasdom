const now = require('performance-now');
const fs = require('fs');

function main(params) {

  var machine_id = fs.readFileSync('/sys/class/dmi/id/product_uuid', 'utf-8');
  var instance_id = fs.readFileSync('/proc/self/cgroup', 'utf-8');
  var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
  var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  var uptime = fs.readFileSync('/proc/uptime', 'utf-8');

  var n;

  if(params && params.n) {
      n = params.n;
  } else {
      n = 100;
  }

  let start = now();
  let result = matrix(n);
  let end = now();

  return {
    success: true,
    payload: {
        "test": "matrix test",
        "n": Number(n),
        "time": Number((end-start).toFixed(3))
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

exports.main = main;