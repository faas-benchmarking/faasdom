exports.handler = function(event, context, callback) {

    // TODO: put your code here
  
   var res ={
       "statusCode": 200,
       "headers": {
           "Content-Type": "application/json"
       }
   };
   
   res.body = JSON.stringify({
      payload: "ok"
   });
   
   callback(null, res);
};