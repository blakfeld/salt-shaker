
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var routescan = require('express-routescan');
var io = require('socket.io');

// Test Requires
Salt_Database = require('./salt-database').Salt_Database;
salt_database = new Salt_Database();

var app = express();
var server = http.createServer(app)
var io = io.listen(server);

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
app.use(express.static(path.join(__dirname, 'public')));

// Route Scan
routescan(app);

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/reference', function(req, res) {
  res.render('reference');
});

app.get('/socket_test', function(req, res) {
  res.render('socket_test');
});

// Sockets
io.on('connection', function(socket) {
  
  socket.on('get_minion_list', function(error, data) {
    salt_database.getAllMinions(function(error, data) {
      socket.emit('minion_list', {'minions': data});
    });
  });

  socket.on('refresh_minion_list', function(error) {
    salt_database.addMinionsToDatabase(function(error, data) {
      salt_database.getAllMinions(function(error, docs) {
        socket.emit('minion_list', {'minions': docs});
      });
    });
  });

});

// Start Server
app.start = app.listen = function() {
  return server.listen.apply(server, arguments);
}

app.start(app.get('port'));