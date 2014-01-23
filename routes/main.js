/**
 * Routing for Home Page
 */

module.exports = function(app) {
   app.get('/', function(req, res) {
    res.render('index', {title: 'Home'});
   });
}