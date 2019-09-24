exports.handler = function(event, context, callback) {
   
   const res = {
    statusCode: 200,
    headers: {
       'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        success: true,
        payload: {
            'test': 'latency test',
        }
    })
  };
  callback(null, res);
};