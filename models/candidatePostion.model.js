const { Schema, model } = require('mongoose');

const candidatepositionSchema = new Schema({
  candidateId: {
    type: String,
    required: [1, 'Candidate id is required']
  },
  positionId: {
    type: String,
    required: [1, 'Position id is required']
  }
});

const CandidatePosition = model('CandidatePosition', candidatepositionSchema);

module.exports = { CandidatePosition };