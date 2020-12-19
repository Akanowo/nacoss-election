const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  email: {
    type: String,
    maxlength: 100,
    required: [1, 'Email is required']
  },
  password: {
    type: String,
    maxlength: 15,
    default: 'mrMichael123'
  }
});

const Admin = model('Admin', adminSchema);

module.exports = { Admin };