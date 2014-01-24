/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var gzippo = require('gzippo');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var salt_sockets = require('./salt-sockets');

// Init Express
var app = express();
var server = http.createServer(app)

// Express Setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// Gzippo
app.use(gzippo.staticGzip(__dirname + '/public'));
app.use(gzippo.compress());

// Passport
// app.use(express.session({secret: '9cb1fafa4f464822f4fbbe48f3436faf'}));
// app.use(passport.initialilze);
// app.use(passport.session());
// app.use(flash());
var routes = require('./routes')(app);
app.use(app.router);

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