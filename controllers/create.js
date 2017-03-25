/**
 * GET /quiz/create
 * Quiz page
 */
exports.index = (req, res) => {
  res.render('quiz/create', {
    title: 'Create'
  });
};

/**
 * post /quiz/create
 * page
 */
// exports.postQuiz = (req, res) =>{
// }