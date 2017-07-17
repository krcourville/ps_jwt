/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("../services/createSendToken");

module.exports = {
  login: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(401).send({
        message: "username and password required",
      });
    }

    User.findOneByEmail(email, function(err, foundUser) {
      if (!foundUser) {
        return res.status(401).send({
          message: "username or password invalid",
        });
      }

      bcrypt.compare(password, foundUser.password, function(err, valid) {
        if (err) return res.status(403);

        if (!valid) {
          return res.status(401).send({
            message: "username or password invalid",
          });
        }
        createSendToken(foundUser, res);
      });
    });
  },

  register: function(req, res) {
    console.log("REGISTER_BEGIN");

    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(401).send({
        message: "username and password required",
      });
    }

    console.log("REGISTER_BEGIN, SEARCH");

    User.create({
      email,
      password,
    }).exec(function(err, user) {
      if (err) {
        console.error("CREATE_ERR", err);
        return res.status(403);
      }

      console.log("REGISTER_BEGIN, CREATE");

      createSendToken(user, res);
    });
  },
};
