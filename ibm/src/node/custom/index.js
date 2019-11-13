const now = require('performance-now');

function main(params) {
    let start = now();

    /* 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    */

    let end = now();
    return {
        success: true,
        payload: {
            'test': 'custom test',
            'time': Number((end-start).toFixed(3))
        }
      };
}

exports.main = main;