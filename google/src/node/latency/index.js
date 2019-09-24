exports.node_latency = (req, res) => {
  
  res.set("Content-Type", "application/json");
	res.status(200);
  res.send(JSON.stringify({
      success: true,
      payload: {
          "test": "latency test"
      }
  }));

};
