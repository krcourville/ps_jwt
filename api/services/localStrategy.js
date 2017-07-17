var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

var options = { usernameField: "email" };

//
// HANDLE LOGIN
function verifyLogin(email, password, done) {
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

exports.login = new LocalStrategy(options, verifyLogin);

//
// HANDLE REGISTER
function verifyRegister(email, password, done) {
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

exports.register = new LocalStrategy(options, verifyRegister);
