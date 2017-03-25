const User = require('../models/User');
const Group = require('../models/Group');

exports.index = (req, res) => {
  let groupsTeaching;
  Group.find({
    _id: { $in: req.user.groupsTeaching }
  }).then(_groupsTeaching => {
    groupsTeaching = _groupsTeaching;
    return Group.find({
      _id: {$in: req.user.groupsLearning}
    });
  }).then(groupsLearning => {
    res.render('group/index', {
      title: 'Groups',
      groupsTeaching,
      groupsLearning
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

/**
 * GET /group/join
 * Join a group
 */
exports.getJoinGroup = (req, res, next) => {
  console.log(req.params.id);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/group');
  }

  let user;
  User.findById(req.user.id)
    .then(_user => {
      user = _user;
      return Group.findById(req.params.id);
    }).then(group => {
      if (user._id in group.students) {
        res.redirect('/group');
        return;
      }

      group.students.push(user);
      group.save().catch(err => { throw err });

      user.groupsLearning.push(group);
      user.save().catch(err => { throw err });

      req.flash('success', { msg: `Joined group "${group.name}".` });
      res.redirect('/group');
    }).catch(err => next(err));
};

/**
 * GET /group/:id
 * Homepage of the group
 */
exports.getHome = (req, res) => {
  Group.findById(req.params.id)
    .then(group => {
      res.render('group/home', {
        title: group.name,
        group
      });
    });
};

