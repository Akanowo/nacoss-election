const { Schema, model } = require('mongoose');

const voteCountSchema = new Schema({
  candidateId: {
    type: String,
    required: [1, 'Candidate Id is required']
  },
  positionId: {
    type: String,
    required: [1, 'Position Id required']
  },
  voteCount: {
    type: Number,
    required: [1, 'Vote is required'],
    default: 0
  }
});

const VoteCount = model('VoteCount', voteCountSchema);

module.exports = { VoteCount };