var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var schema = new mongoose.Schema({
  email: { type: String, required: false, trim: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  displayName: { type: String, required: false },
});

schema.pre("save", function(next) {
  var user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(new Error(err));
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(new Error(err));
      }
      user.password = hash;
      next();
    });
  });
});

schema.methods.toJSON = function() {
  var user = this.toObject();
  delete user.password;
  return user;
};

schema.methods.comparePasswords = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

module.exports = mongoose.model("User", schema);
