var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var request = require("request");

var User = require("./models/user");
var jwt = require("jwt-simple");

var secret = "*Password4321";

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

var strategyOptions = { usernameField: "email" };

//
// HANDLE LOGIN
function loginStrategyVerify(email, password, done) {
  var searchUser = { email };
  User.findOne(searchUser, function(err, user) {
    if (err) return done(err);

    if (!user) {
      return done(null, false, {
        message: "Wrong email/password",
      });
    }

    user.comparePasswords(password, function(err, isMatch) {
      if (err) return done(err);

      if (!isMatch) {
        return done(null, false, {
          message: "Wrong email/password",
        });
      }

      return done(null, user);
    });
  });
}

//
// HANDLE REGISTER
function registerStrategyVerify(email, password, done) {
  var newUser = new User({ email, password });

  User.findOne({ email }, function(err, user) {
    if (err) return done(err);

    if (user)
      return done(null, false, {
        message: "email already exists",
      });

    newUser.save(function(err) {
      done(null, newUser);
    });
  });
}

passport.use(
  "local-login",
  new LocalStrategy(strategyOptions, loginStrategyVerify)
);

passport.use(
  "local-register",
  new LocalStrategy(strategyOptions, registerStrategyVerify)
);

//
// POST /register
app.post("/register", passport.authenticate("local-register"), function(
  req,
  res
) {
  createSendToken(req.user, res);
});

//
// POST login
app.post("/login", passport.authenticate("local-login"), function(req, res) {
  createSendToken(req.user, res);
});

var jobs = ["Cook", "SuperHero", "Unicorn Whisperer", "Toast Inspector"];
//
// GET /jobs
app.get("/jobs", function(req, res) {
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
});

//
// POST /auth/google
app.post("/auth/google", function(req, res) {
  console.log("BODY", req.body);
  var url = "https://accounts.google.com/o/oauth2/token";
  var apiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: "authorization_code",
    client_secret: "lWfQBKSIRo1z9sDAsVJXp7GN",
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
});

mongoose.connect("mongodb://localhost/psjwt");

var server = app.listen(3000, function() {
  console.log("api listening on ", server.address().port);
});

function createSendToken(user, res) {
  var payload = {
    sub: user.id,
  };
  var token = jwt.encode(payload, secret);
  res.status(200).send({
    user: user.toJSON(),
    token: token,
  });
}
