var jwt = require("jwt-simple");

module.exports = function(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({
      message: "Authentication failed",
    });
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, "*Password4321");

  if (!payload.sub) {
    return res.status(401).send({
      message: "Authentication failed",
    });
  }

  next();
};
