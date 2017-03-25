const User = require('../models/User');
const Group = require('../models/Group');

exports.index = (req, res) => {
  Group.find({
    _id: { $in: req.user.groupsTeaching }
  })
  .then(groupsTeaching => {
    res.render('group/index', {
      title: 'Groups',
      groupsTeaching
    });
  });
};

/**
 * POST /group/create
 * Create a group
 */
exports.postCreateGroup = (req, res, next) => {
  req.assert('name', 'Please enter a valid group name.').notEmpty();
  req.assert('name', '6 to 20 characters required.').len(6, 20);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/group/create');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    const group = new Group({
      teacher: req.user,
      students: [],
      name: req.body.name,
      desc: req.body.desc,
      quizzes: [],
    });

    group.save()
      .then(() => {
        user.groupsTeaching.push(group);
        user.save();
      })
      .then(() => {
        req.flash('success', { msg: `Created group "${req.body.name}".` });
        res.redirect('/group');
      })
      .catch(err => next(err));
  });
};

/**
 * GET /group/create
 * Displays the form for creating a group
 */
exports.getCreateGroup = (req, res) => {
  res.render('group/create', {
    title: 'Create a Group',
  });
};

