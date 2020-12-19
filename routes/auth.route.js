const authRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const debug = require('debug')('app:auth-route');

const routes = () => {
  const {
    getIndex,
    changePassword
  } = authController;

  authRouter.route('/login')
    .get(getIndex)
    .post(function(req, res) {
      passport.authenticate('local', function (err, user, info) {
        if(err) {
          return res.json({
            status: 'failed',
            info,
            error: err
          });
        }

        if(user.hasVoted) {
          return res.status(401).json({
            status: 'failed',
            message: 'User has voted'
          });
        }

        if (user.isFirstLogin) {
          return res.json({
            status: 'success',
            info,
            isFirstLogin: user.isFirstLogin,
            password: user.password
          });
        }
        return req.logIn(user, (err) => {
          if (err) {
            return res.json({
              status: 'failed',
              info,
              error: err.message
            });
          }

          return res.json({
            status: 'success',
            info,
            isFirstLogin: user.isFirstLogin,
          });
        });
      })(req, res);
    });

  authRouter.route('/change-pwd')
    .post(changePassword);

  authRouter.route('/login/admin')
    .get((req, res) => {
      res.render('admin/login');
    });

  authRouter.route('/logout')
    .get((req, res) => {
      req.logOut();
      return res.json({
        status: 'logged out',
        message: 'Logout successful'
      });
    });

  return authRouter;
};

module.exports = routes;