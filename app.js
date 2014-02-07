/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var salt_sockets = require('./salt-sockets');

// Init Express
var app = express();
var server = http.createServer(app);

// Init passport config
require('./config/passport')(passport);

// Express Setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Passport
app.use(express.session(
    { secret: '4f51819636522b04a19c0aebfdf99d87' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Pass Auth info to pages
app.use( function(req, res, next) {
    res.locals.request = req;

    res.locals.user = req.user;
    next();
});


var routes = require('./routes')(app,passport);
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


/**
 * Start Express Listening
 * @type {listen}
 * @return {object} Express Server Listener
 */
app.start = app.listen = function() {
    return server.listen.apply(server, arguments);
}

app.start(app.get('port'));
