exports.node_custom = (req, res) => {

  /* 
  TODO: put your code here
  You can basically do anything you want,
  but please leave the return statement header
  and the success field as it is.
  */

  res.set("Content-Type", "application/json");
	res.status(200);
  res.send(JSON.stringify({
      success: true,
      payload: {
          "test": "custom test"
      }
  }));

};
