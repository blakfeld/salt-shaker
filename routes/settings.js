/*
 * GET Settings page.
 */

module.exports = {
  '/settings': function(req, res) {
    res.render('settings', {title: 'Settings'});
  }
};