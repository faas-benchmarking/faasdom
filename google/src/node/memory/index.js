var fs = require("fs");

exports.node_memory = (req, res) => {
  
    var cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    var meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
    var uptime = fs.readFileSync('/proc/uptime', 'utf-8');                 

    var text = '';

    for(let i = 0; i<req.query.n; i++) {
        text += 'A';
    }
	
    res.set("Content-Type", "application/json");
	res.status(200);
    res.send(JSON.stringify({
      success: true,
      payload: {
          "test": "memory test",
          "n": Number(req.query.n)
      },
      metrics: {
          machineid: '',
          instanceid: '',
          cpu: cpuinfo,
          mem: meminfo,
          uptime: uptime
      }
  }));
};
