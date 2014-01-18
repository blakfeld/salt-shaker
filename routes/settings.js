
/*
 * GET Settings page.
 */


module.exports = {
  '/settings': function(req, res) {
    res.render('settings', {title: 'Settings'});
  },
  '/settings/edit': function(req, res) {
    res.render('settings_edit', {title: 'Settings'});
  }
};