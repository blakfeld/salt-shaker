/*
 * GET Login page.
 */

module.exports = {
  '/login': function(req, res) {
    res.render('login', {title: 'Login'});
  }
};