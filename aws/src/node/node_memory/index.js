var fs = require("fs");

exports.handler = async (event, context, callback) => {

    var instanceId = fs.readFileSync('/proc/self/cgroup', 'utf-8');
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');

    var text = '';

    for(let i = 0; i<event.queryStringParameters.n; i++) {
        text += 'A';
    }
    
    const response = {
        statusCode: 200,
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
            payload: "memory test",
            success: true,
            n: event.queryStringParameters.n,
            id: instanceId,
            cpu: cpuinfo,
            mem: meminfo,
            uptime: uptime
        })
    };
    
    return response;
};