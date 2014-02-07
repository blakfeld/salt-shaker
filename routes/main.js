/**
 * Routing for Home Page
 */

var login = require('connect-ensure-login');

module.exports = function(app, passport) {

    /**
     * Index
     */

    app.get('/', login.ensureLoggedIn('/login'), function(req, res) {
        console.log(req.user);
        res.render('index', {title: 'Home'});
    });

    /**
     * Login
     */

    app.get('/login', function(req, res) {
        if (req.user) {
            res.redirect('/');
        } else {
            res.render('login', {
                title: 'Login',
                message: req.flash('loginMessage')
            });
        }
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /**
     * Logout
     */

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });
};