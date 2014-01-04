
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var routescan = require('express-routescan');

// Test Requires
Salt_Database = require('./salt-database').Salt_Database;
salt_database = new Salt_Database();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Route Scan
routescan(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/reference', function(req, res) {
  res.render('reference');
});

app.get('/database', function(req, res){
  salt_database.addMinionsToDatabase(function(error){
    if (error) {
      res.send("Error: " + error);
    } else {
      res.send("It worked?");
    }
  })
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
