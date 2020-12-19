const { User } = require('../models/user.model');
const passport = require('passport');
require('./strategies/passport-local');

const passportInit = () => {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(user, done) {
    return done(null, user);
  });
};

module.exports = passportInit;