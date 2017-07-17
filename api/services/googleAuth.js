var request = require("request");

var createSendToken = require("./jwt");
var User = require("../models/user");
var config = require("./config");

module.exports = function(req, res) {
  console.log("BODY", req.body);
  var url = "https://accounts.google.com/o/oauth2/token";
  var apiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: "authorization_code",
    client_secret: config.GOOGLE_SECRET,
  };

  request.post(url, { json: true, form: params }, function(
    err,
    response,
    token
  ) {
    var accessToken = token.access_token;
    var headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    request.get(
      {
        url: apiUrl,
        headers,
        json: true,
      },
      function(err, response, profile) {
        if (err) throw err;

        User.findOne({ googleId: profile.sub }, function(err, foundUser) {
          if (foundUser) return createSendToken(foundUser, res);

          var newUser = new User();
          newUser.googleId = profile.sub;
          newUser.displayName = profile.name;

          newUser.save(function(err) {
            if (err) throw err;

            return createSendToken(newUser, res);
          });
        });
      }
    );
  });
};
