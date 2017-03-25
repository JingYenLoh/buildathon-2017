/**
 * GET /quiz
 * Quiz page
 */
exports.index = (req, res) => {
  res.render('quiz', {
    title: 'Quiz'
  });
};
