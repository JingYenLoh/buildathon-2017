/**
 * GET /stats
 * Statistics on Quiz (it's hard coded, what about it?)
 */
exports.index = (req, res) => {
  res.render('stats', {
    title: 'Statistics'
  });
};
