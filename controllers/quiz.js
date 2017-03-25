const Quiz = require('../models/Quiz');
const User = require('../models/User');
// const Group = require('../models/Group');
const Question = require('../models/Question');

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
 * POST /quiz/:id/add
 * Create a question
 */
exports.postAddQuestion = (req, res, next) => {
  req.assert('question', 'Please enter a question.').notEmpty();
  req.assert('choices', 'Please enter your choices').notEmpty();
  req.assert('answer', 'Please enter an answer.').notEmpty();

  const errs = req.validationErrors();

  if (errs) {
    req.flash('errors', errs);
    return res.redirect(`quiz/${req.params.id}/add`);
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    const question = new Question({
      teacher: req.user,
      question: req.body.question,
      // TODO:
      // choice: req.
      choices: req.body.choices,
      answer: req.answer
    });

    question.save()
      .then(() => {
        user.questions.push(question);
        // TODO: some weird shit regarding :id
        // like do i need to select the question lol
        // req.params.id
      })
      .then(() => req.flash('success', { msg: `Created question "${req.body.name}` }))
      .catch(err => next(err));
  });
};

/**
 * GET /quiz/:id/add
 * Form to create question
 */
exports.getAddQuestion = (req, res) => {
  Quiz.findById(req.params.id)
    .then((quiz) => {
      res.render('quiz/home/add', {
        title: quiz.name,
        quiz
      });
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
