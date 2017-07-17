var jwt = require("jwt-simple");
var moment = require("moment");

var secret = require("./config").JWT_SECRET;

module.exports = function createSendToken(user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, "days").unix(),
  };
  var token = jwt.encode(payload, secret);
  res.status(200).send({
    user: user.toJSON(),
    token: token,
  });
};
