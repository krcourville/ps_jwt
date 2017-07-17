var request = require("request");
var qs = require("querystring");

var createSendToken = require("./jwt");
var User = require("../models/user");
var config = require("./config");

module.exports = function(req, res) {
  var accessTokenUrl = "https://graph.facebook.com/oauth/access_token";
  var graphApiUrl = "https://graph.facebook.com/me";

  var params = {
    client_id: req.body.clientId,
    redirect_id: req.body.redirectUri,
    client_secret: config.FACEBOOK_SECRET,
    code: req.body.code,
  };

  request.get({ url: accessTokenUrl, qa: params }, function(
    err,
    response,
    accessToken
  ) {
    accessToken = qs.parse(accessToken);

    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(
      err,
      response,
      profile
    ) {
      User.findOne({ facebookId: profile.id }, function(err, existingUser) {
        if (existingUser) {
          return createSendToken(existingUser, res);
        }

        var newUser = new User();
        newUser.facebookId = profile.id;
        newUser.displayName = profile.name;
        newUser.save(function(err) {
          createSendToken(newUser, res);
        });
      });
    });
  });
};
