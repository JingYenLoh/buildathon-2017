/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

/**
 GET/
 About page.
 */


exports.about = (req, res) => {
  res.render('about', {
    title: 'About'
  });
};
