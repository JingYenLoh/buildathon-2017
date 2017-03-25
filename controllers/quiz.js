const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Group = require('../models/Group');

exports.index = (req, res) => {
  Quiz.find({
    _id: { $in: req.user.quizzes }
  }).then(quizzes => {
    res.render('quiz/index', {
      title: 'Quizzes',
      quizzes
    });
  });
};

/**
 * GET /quiz/create
 * Display form for creating quiz
 */
exports.getCreateQuiz = (req, res) => {
  res.render('quiz/create', {
    title: 'Create'
  });
};

/**
 * POST /quiz/create
 * Create a quiz
 */
exports.postCreateQuiz = (req, res, next) => {
  req.assert('name', 'Please enter a valid quiz name.').notEmpty();
  req.assert('name', '6 to 20 characters required').len(6, 20);

  const errs = req.validationErrors();

  if (errs) {
    req.flash('errors', errs);
    return res.redirect('quiz/create');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    const quiz = new Quiz({
      name: req.body.name,
      teacher: req.user,
      questions: []
    });

    quiz.save()
      .then(() => {
        user.quizzes.push(quiz);
        user.save();
      })
      .then(() => {
        req.flash('success', { msg: `Created quiz "${req.body.name}"` });
      })
      .catch(err => next(err));
  });
};

/**
 * GET /quiz/:id
 * specific quiz question
 */
exports.getHome = (req, res) => {
  Quiz.findById(req.params.id)
    .then((quiz) => {
      res.render('quiz/home', {
        title: quiz.name,
        quiz
      });
    });
};

// exports.postCreateQuiz = (req, res, next) => {

// }
