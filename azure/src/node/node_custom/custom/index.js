const now = require('performance-now');

module.exports = async function (context, req) {
    let start = now();

    /* 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    */

    let end = now();
    context.res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            success: true,
            payload: {
                'test': 'custom test',
                'time': Number((end-start).toFixed(3))
            }
        })
      };
};