/*
 * Routing for Settings Pages
 */

module.exports = function (app) {

    app.get('/settings', function (req, res) {
        res.render('settings', {title: 'Settings', subtitle: 'Server'});
    });

}