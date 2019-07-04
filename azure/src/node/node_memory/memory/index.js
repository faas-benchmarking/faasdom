module.exports = async function (context, req) {

    var instanceId = process.env['WEBSITE_INSTANCE_ID'];
    /*var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');*/
    
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
            payload: "memory test",
            success: true,
            n: req.query.n,
            id: instanceId,
            cpu: '',
            mem: '',
            uptime: ''
        })
    };
};