
/*
 * GET minions page.
 */

var Salt_Database = require('../salt-database').Salt_Database;
var salt_database = new Salt_Database();

// 'use strict';

module.exports = {
  '/minions': function(req, res) {
    res.render('minions', {title: 'Minions'});

  },
  '/minions/:id': function(req, res) {
    salt_database.getMinionById(req.params.id, function(error, docs) {
      console.log(docs)
      console.log("name: " + docs['name'] + " grains: " + docs['grains']);
      res.render('each_minion', {title: docs['name'], items: docs['grains']});
    });
   }
};