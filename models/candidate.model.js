const { Schema, model } = require('mongoose');

const candidateSchema = new Schema({
  matNo: {
    type: String,
    required: [1, 'Matric number is required']
  },
  image: {
    type: String,
    required: [1, 'Upload candidate image']
  }
});

const Candidate = model('Candidate', candidateSchema);

module.exports = { Candidate };