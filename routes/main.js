/**
 * Routing for Home Page
 */

module.exports = function(app, passport) {

    /**
     * Index
     */

    app.get('/', function(req, res) {
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