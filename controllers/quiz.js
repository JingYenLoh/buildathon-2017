const Quiz = require('../models/Quiz');
const User = require('../models/User');
// const Group = require('../models/Group');
const Question = require('../models/Question');

exports.index = (req, res) => {
  Quiz.find({
    _id: { $in: req.user.quizzes }
  }).then((quizzes) => {
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
    return res.redirect('create');
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
        return user.save();
      })
      .then(() => {
        req.flash('success', { msg: `Created quiz "${req.body.name}"` });
        return res.redirect('create');
      })
      .catch(err => next(err));
  });
};

/**
 * GET /quiz/:id/add
 * Form to create question
 */
exports.getAddQuestion = (req, res, next) => {
  Quiz.findById(req.params.id)
    .then((quiz) => {
      res.render('quiz/home/add', {
        title: quiz.name,
        quiz,
        id: req.params.id
      });
    }).catch(err => next(err));
};

/**
 * POST /quiz/:id/add
 * Create a question
 */
exports.postAddQuestion = (req, res, next) => {
  req.assert('question', 'Please enter a question.').notEmpty();
  req.assert('answer', 'Please select an answer.').notEmpty();

  const errs = req.validationErrors();

  if (errs) {
    req.flash('errors', errs);
    return res.redirect('add');
  }

  Quiz.findById(req.params.id, (err, quiz) => {
    if (err) { return next(err); }

    const choices = [];
    choices[0] = req.body['choice-1'];
    choices[1] = req.body['choice-2'];
    choices[2] = req.body['choice-3'];
    choices[3] = req.body['choice-4'];

    const question = new Question({
      teacher: req.user,
      question: req.body.question,
      choices,
      answer: req.answer
    });

    question.save()
      .then(() => {
        quiz.questions.push(question);
      })
      .then(() => {
        req.flash('success', { msg: 'Added question' });
        res.redirect('add');
      })
      .catch(err => next(err));
  });
};

/**
 * GET /quiz/home
 * Question homepage idk
 */
exports.getHome = (req, res) => {
  Quiz.findById(req.params.id)
    .then((quiz) => {
      res.render('quiz/home/index', {
        title: 'Create questions',
        quiz
      });
    });
};
