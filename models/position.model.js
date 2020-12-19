const { Schema, model } = require('mongoose');

const positionSchema = new Schema({
  name: {
    type: String,
    required: [1, 'Position name is required']
  },
  desc: {
    type: String,
    required: [1, 'Position description is required']
  }
});

const Position = model('Position', positionSchema);

module.exports = { Position };