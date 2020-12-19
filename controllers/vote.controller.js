// jshint esversion:8
const debug = require('debug')('app:voteController');
const { Candidate } = require('../models/candidate.model');
const { Position } = require('../models/position.model');
const { User } = require('../models/user.model');
const { CandidatePosition } = require('../models/candidatePostion.model');
const { VoteCount } = require('../models/voteCountModel');

const voteController = () => {
  const getIndex = async (req, res) => {
    const electionDetails = [];
    try {
      const allCandidates = await CandidatePosition.find();
      const positions = await Position.find();
      for (let oneCandidate of allCandidates) {
        const candidate = await Candidate.findOne({ _id: oneCandidate.candidateId });
        const position = await Position.findOne({ _id: oneCandidate.positionId });
        const candidateDetail = await User.findOne({ matNo: candidate.matNo });
        debug(candidate.image);
        const imageSplit = candidate.image.split('/');
        electionDetails.push({
          name: candidateDetail.name,
          id: candidate._id,
          matNo: candidate.matNo,
          image: `${'/' + imageSplit[2] + '/' + imageSplit[3] + '/' + imageSplit[4] }`,
          post: position.name,
          votes: candidate.votes
        });
      }

      const posts = {
      };

      for(let position of positions) {
        const postContesters = electionDetails.filter((x) => x.post === position.name);
        posts[position.name] = {};
        posts[position.name].candidates = postContesters;
      }

      debug(req.user);

      const user = await User.findOne({ _id: req.user });
      return res.render('vote', { positions, posts, user: user.name });
    } catch (error) {
      debug(error);
      return res.json({
        status: 'failed',
        message: 'candidates fetch unsuccessful',
        error
      });
    }
  };

  const postVote = async (req, res) => {
    debug(req.body);
    const { candidates } = req.body;
    for (let i = 0; i < candidates.length; i++) {
      try {
        const contester = await VoteCount.findOne({ candidateId: candidates[i].id });
        debug(contester);
        const update = contester;
        update.voteCount++;
        const voteCountUpdate = await VoteCount.findByIdAndUpdate(contester._id, update);
        if (voteCountUpdate && i === candidates.length - 1) {
          const newUserUpdate = await User.findByIdAndUpdate(req.user, { hasVoted: true });
          if (newUserUpdate) {
            return res.json({
              status: 'success',
              message: 'Vote successful and user update successful',
            });
          }
        }
      } catch (error) {
        debug(error);
        return res.json({
          status: 'failed',
          message: 'Vote unsuccessful and user update unsuccessful',
          error
        });
      }
    }
  };

  const middleware = (req, res, next) => {
    try {
      if (req.session.passport.user) {
        return next();
      }
    } catch (error) {
      return res.json({
        status: 'session-timeout',
        message: 'Sorry your session has expired'
      });
    }
  };

  return {
    getIndex,
    postVote,
    middleware
  };
};

module.exports = voteController();