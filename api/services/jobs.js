var jwt = require("jwt-simple");

var jobs = ["Cook", "SuperHero", "Unicorn Whisperer", "Toast Inspector"];

module.exports = function(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: "You are not authorized",
    });
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, secret);

  if (!payload.sub) {
    res.status(401).send({ message: "Authentication failed" });
  }

  res.json(jobs);
};
