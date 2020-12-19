// jshint esversion:8
const { User } = require('../models/user.model');
const debug = require('debug')('app:authController');
const bcrypt = require('bcrypt');

const authController = () => {
  const getIndex = (req, res) => {
    return res.render('index');
  };

  const changePassword = async (req, res) => {
    const { user } = req.body;
    const { password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      User.findOne({ matNo: user }, (err, doc) => {
        if (err) {
          return res.json({
            status: 'failed',
            message: 'An error occured',
            error: err
          });
        }
        return User.updateOne({ _id: doc._id }, {
          matNo: doc.matNo,
          password: hashedPassword,
          department: doc.department,
          gender: doc.gender,
          phone: doc.phone,
          isFirstLogin: false,
          hasVoted: false
        }, (e, raw) => {
          if (e) {
            return res.json({
              status: 'failed',
              message: 'An error occured',
              error: e
            });
          }
          debug(raw);
          const user = doc;
          req.logIn(user, (err) => {
            if (err) {
              return res.json({
                status: 'failed',
                error: err
              });
            }

            return res.json({
              status: 'success',
              message: 'Update successful'
            });
          });
        });
      });
    } catch (error) {
      return res.json({
        status: 'failed',
        message: 'Login first',
        error
      });
    }
  };

  return {
    getIndex,
    changePassword
  };
};

module.exports = authController();