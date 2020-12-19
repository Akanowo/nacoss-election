const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  matNo: {
    type: String,
    required: [1, 'Matric number is a required field']
  },
  name: {
    type: String,
    required: [1, 'Name is a required field']
  },
  password: {
    type: String,
    required: [1, 'Password is a required field']
  },
  department: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  }
});

const User = model('User', userSchema);

module.exports = { User };