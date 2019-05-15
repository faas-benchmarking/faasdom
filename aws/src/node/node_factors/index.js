const now = require('performance-now');

exports.handler = function(event, context, callback) {
  var res ={
      "statusCode": 200,
      "headers": {
          "Content-Type": "*/*"
      }
  };

  let start = now();
  let n = 2688834647444046;
  let result = factors(n);
  let end = now();
  
  res.body = JSON.stringify({ 'n': n, 'result': result, 'time(ms)': (end-start).toFixed(3) });
  callback(null, res);
};

function factors(num) {
  let n_factors = [];
 
  for (let i = 1; i <= Math.floor(Math.sqrt(num)); i += 1)
    if (num % i === 0) {
      n_factors.push(i);
      if (num / i !== i) {
        n_factors.push(num / i);
      }
    }

  n_factors.sort(function(a, b){return a - b;});

  return n_factors;
}
