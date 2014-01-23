/**
 * Route Manager
 */

module.exports = function(app) {
  require('./main')(app);
  require('./minions')(app);
  require('./settings')(app);
}
