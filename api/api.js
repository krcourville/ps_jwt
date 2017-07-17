var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");

var jwt = require("jwt-simple");
var googleAuth = require("./services/googleAuth");
var facebookAuth = require("./services/facebookAuth");
var secret = require("./services/config").JWT_SECRET;
var LocalStrategy = require("./services/localStrategy");
var jobs = require("./services/jobs");

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

passport.use("local-login", LocalStrategy.login);
passport.use("local-register", LocalStrategy.register);

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

//
// POST /auth/facebook
app.post("/auth/facebook", facebookAuth);

//
// GET /jobs
app.get("/jobs", jobs);

//
// POST /auth/google
app.post("/auth/google", googleAuth);

mongoose.connect("mongodb://localhost/psjwt");

var server = app.listen(3000, function() {
  console.log("api listening on ", server.address().port);
});
