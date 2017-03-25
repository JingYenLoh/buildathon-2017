const Quiz = require('../models/Quiz');

exports.index = (req, res) => {
  res.render('quiz/index', {
    title: 'Create'
  });
};

exports.getCreateQuiz = (req, res) => {
  res.render('quiz/create', {
    title: 'Create'
  });
};

// exports.postCreateQuiz = (req, res, next) => {

// }