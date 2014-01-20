
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var gzippo = require('gzippo')
var routescan = require('express-routescan');
var salt_sockets = require('./salt-sockets');

// Init Express
var app = express();
var server = http.createServer(app)

// All environments
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
app.use(gzippo.staticGzip(__dirname + '/public'));
app.use(gzippo.compress());


// Route Scan
routescan(app);

// Socket Listener
salt_sockets(server);

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Development Reference Page
app.get('/reference', function(req, res) {
  res.render('reference');
});

// Start Server
app.start = app.listen = function() {
  return server.listen.apply(server, arguments);
}

app.start(app.get('port'));