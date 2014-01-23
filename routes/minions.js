/**
 * Routing for Minion Pages
 */

module.exports = function(app) {
  var Salt_Database = require('../salt-database').Salt_Database;
  var salt_database = new Salt_Database();
  
  app.get('/minions', function(req, res) {
    res.render('minions', {title: 'Minions'});
  });

  app.get('/minions/:id', function(req, res) {
    salt_database.getMinionById(req.params.id, function(error, docs) {
        res.render('each_minion', {title: docs['name'], items: docs['grains']});
    });
  });
}