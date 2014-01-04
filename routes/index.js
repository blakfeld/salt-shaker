
/*
 * GET home page.
 */
 
'use strict';

module.exports = {
  '/': function(req, res) {
    res.render('index', { title: 'Home'});
  }
};