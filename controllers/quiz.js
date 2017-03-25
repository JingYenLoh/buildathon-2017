const Quiz = require('../models/Quiz');

exports.index = (req, res) => {
  Quiz.find({
    _id: { $in: req.user.quizzes }
  }).then(quizzes => {
    res.render('quiz/index', {
      title: 'Create',
      quizzes
    });
  });
};

exports.getCreateQuiz = (req, res) => {
  res.render('quiz/create', {
    title: 'Create'
  });
};

// exports.postCreateQuiz = (req, res, next) => {

// }
