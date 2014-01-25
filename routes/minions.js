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
    salt_database.getMinionById(req.params.id, function(error, data) {
        res.render('each_minion_grains', {title: data['name'], subtitle: 'Grains', items: data['grains'], id: req.params.id});
    });
  });

  app.get('/minions/:id/highstate', function(req, res) {
    salt_database.getMinionById(req.params.id, function(error, data) {
      res.render('each_minion_highstate', {title: data['name'], subtitle: 'Highstate'});
    });
  });
}