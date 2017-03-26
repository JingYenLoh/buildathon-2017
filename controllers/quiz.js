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
        return res.redirect(`/quiz/${quiz._id}`);
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
      quiz,
      question: req.body.question,
      choices,
      answer: req.body.answer,
      meaning: req.body.meaning, 
    });

    question.save()
      .then(() => {
        quiz.questions.push(question);
        return quiz.save();
      })
      .then(() => {
        req.flash('success', { msg: 'Added question' });
        res.redirect('add');
      })
      .catch(err => next(err));
  });
};

/**
 * GET /quiz/:id
 * Question homepage idk
 */
exports.getHome = (req, res) => {
  let quiz;
  Quiz.findById(req.params.id)
    .then((_quiz) => {
      quiz = _quiz;
      return Question.find({
        _id: { $in: quiz.questions }
      });
    }).then((questions) => {
      res.render('quiz/home/index', {
        title: 'Create questions',
        id: req.params.id,
        quiz,
        questions
      });
    });
};

/**
 * GET /quiz/:id/:index
 * Display a question
 */
exports.getQuestion = (req, res) => {
  let quiz;
  Quiz.findById(req.params.id)
    .then((_quiz) => {
      quiz = _quiz;
      return Question.find({
        _id: { $in: quiz.questions }
      });
    }).then((questions) => {
      res.render('quiz/home/question', {
        title: `${quiz.name} - Question ${req.params.index}`,
        id: req.params.id,
        index: req.params.index,
        quiz,
        points: 0,
        pointsTotal: 0,
        question: questions[req.params.index - 1]
      });
    });
};

/**
 * POST /quiz/:id/:index
 * Solve a question
 */
const randomChoice = array => array[Math.floor(Math.random() * array.length)];
exports.postQuestion = (req, res, next) => {
  let quiz;
  Quiz.findById(req.params.id)
    .then((_quiz) => {
      quiz = _quiz;
      return Question.find({
        _id: { $in: quiz.questions }
      });
    }).then((questions) => {
      const index = parseInt(req.params.index, 10);
      const answer = parseInt(req.body.answer, 10);
      const question = questions[index - 1];

      let points = parseInt(req.body.points, 10);
      let pointsTotal = parseInt(req.body.pointsTotal, 10);
      if (question.answer !== answer) {
        req.flash('errors', { msg: randomChoice([
          'Wrong... Try again!',
          'Hmm, that\'s not correct.',
          'That\'s not right.'
        ]) + ' ' + question.meaning });
        points--;
      } else {
        req.flash('success', { msg: randomChoice([
          'Correct!',
          'Indeed!',
          'Genius!',
          'That\'s right!',
          'Very good!'
        ]) });
        points += 3;
        pointsTotal += points;
        if (index >= questions.length) {
          // res.user.quizzesCompleted.push({ quiz, pointsTotal });
          res.redirect(`/quiz/${req.params.id}`);
        } else {
          res.redirect(index + 1);
        }
      }
      // req.user.questionsCompleted.push({ question, points });
      req.user.save().catch(err => next(err));
      res.render('quiz/home/question', {
        title: `${quiz.name} - Question ${req.params.index}`,
        id: req.params.id,
        index: req.params.index,
        quiz,
        points,
        pointsTotal,
        question
      });
    });
};
