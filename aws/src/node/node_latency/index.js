exports.handler = function(event, context, callback) {
   var res ={
       "statusCode": 200,
       "headers": {
           "Content-Type": "*/*"
       }
   };
   
   res.body = "Latency Test";
   callback(null, res);
};