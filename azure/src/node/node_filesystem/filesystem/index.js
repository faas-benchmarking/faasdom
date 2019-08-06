const fs = require("fs");
const now = require('performance-now');

module.exports = async function (context, req) {
    
    var instanceId = process.env['WEBSITE_INSTANCE_ID'];
    
    var text = '';
    
    for(let i = 0; i<10240; i++) {
        text += 'A';
    }

    if(!fs.existsSync('/tmp/test')){
      fs.mkdirSync('/tmp/test');
    }
    
    let startWrite = now();
    for(let i = 0; i<10000; i++) {
        fs.writeFileSync('/tmp/test/'+i+'.txt', text, 'utf-8');
    }
    let endWrite = now();
    
    let startRead = now();
    for(let i = 0; i<10000; i++) {
        var test = fs.readFileSync('/tmp/test/'+i+'.txt', 'utf-8');
    }
    let endRead = now();
    
    let files = fs.readdirSync('/tmp/test');

    context.res = {
      statusCode: 200,
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
          payload: {"test": "filesystem test", "timeWrite(ms)": (endWrite-startWrite).toFixed(3), "timeRead(ms)": (endRead-startRead).toFixed(3)},
          success: files.length == 10000,
          n: files.length,
          id: instanceId,
          cpu: '',
          mem: '',
          uptime: ''
      })
  };
};
