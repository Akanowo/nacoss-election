const { User } = require('../../models/user.model');
const { Admin } = require('../../models/admin.model');
const debug = require('debug')('app:passport-local');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const passport = require('passport'),
  { Strategy } = require('passport-local');


passport.use(new Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  },
  async function (req, username, password, done) {

    if(req.body.claim === 'admin') {
      const email = username;
      try {
        const admin = await Admin.findOne({ email });
        if(!admin) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        if(admin) {
          if(admin.password === password || bcrypt.compare(password, admin.password)) {
            req.session.cookie.path = '/admin';
            req.session.cookie.maxAge = 3600000;
            return done(null, admin, { message: 'Login successful' });
          } else {
            const error = createError(401, 'Invalid username or password');
            return done(error, false, { message: error.message });
          }
        }
      } catch (error) {
        return done(error, false, { message: 'An error occured' });
      }
    }

    if(req.body.claim === 'user') {
      const matNo = username;
      if(!matNo || !password) {
        const error = createError(400, 'One or more fields missing');
        return done(error, false);
      }
      User.findOne({ matNo }, async (err, user) => {
        if(err) {
          return done(err, false, { message: 'Incorrect matric number or password' });
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect matric number or password' });
        }
        if (user && user.isFirstLogin) {
          if (user.password === password) {
            req.session.cookie.path = '/vote';
            req.session.cookie.maxAge = 60000;
            return done(null, user, { message: 'Login Successful!' });
          } else {
            return done(null, false, { message: 'Incorrect matric number or password' });
          }
        }
  
        if(user && !user.isFirstLogin && user.hasVoted) {
          const error = createError(401, 'User has voted already');
          return done(error, false, { message: 'User has voted already' });
        }
    
        if (user && !user.isFirstLogin) {
          try {
            if (await bcrypt.compare(password, user.password)) {
              req.session.cookie.path = '/vote';
              req.session.cookie.maxAge = 60000;
              return done(null, user, { message: 'Login Successful!' });
            } else {
              return done(null, false, { message: 'Incorrect matric number or password' });
            }
          } catch (error) {
            debug(error);
            return done(error, false, { message: 'An error occured' });
          }
        }
      });
    }
  }
));