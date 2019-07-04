var fs = require("fs");

exports.handler = function(event, context, callback) {
   
   var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
   var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
   var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
   var uptime = fs.readFileSync('/proc/uptime', 'utf-8');
  
   var res ={
       "statusCode": 200,
       "headers": {
           "Content-Type": "application/json"
       }
   };
   
   res.body = JSON.stringify({
      payload: "Latency test",
      id: instanceId,
      cpu: cpuinfo,
      mem: meminfo,
      uptime: uptime
   });
   
   callback(null, res);
};