const now = require('performance-now');

exports.node_custom = (req, res) => {
  let start = now();

  /* 
  TODO: put your code here
  You can basically do anything you want,
  but please leave the return statement header
  and the success field as it is.
  */

  let end = now();
  res.set('Content-Type', 'application/json');
	res.status(200);
  res.send(JSON.stringify({
      success: true,
      payload: {
          'test': 'custom test',
          'time': Number((end-start).toFixed(3))
      }
  }));

};
