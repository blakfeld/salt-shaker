/*
 * Routing for Settings Pages
 */

var Settings_Database = require('../settings-database');
var settings_database = new Settings_Database();

module.exports = function (app) {

    app.get('/settings', function (req, res) {

        settings_database.getSettings('server', function (error, data) {
            if (error) {
                res.render('settings', {title: 'Settings', message: { type: 'danger', title: 'Warning', text: data } });
            }

            if (!data) {

                res.render('settings', {title: 'Settings', host: '', user: '', password: '', auth_type: '', message: ''});

            } else {

                settings = data.settings;
                res.render('settings', {title: 'Settings', host: settings.host, user: settings.user, password: settings.pass, auth_type: settings.auth_type, message: req.flash('settingsMessage')});
            }
        });
    });

    app.post('/settings', function (req, res) {

        var newSettings = {'host': req.body.host, 'user': req.body.user, 'pass': req.body.pass, 'auth_type': req.body.auth_type};

        settings_database.setSettings('server', newSettings, function (error, data) {
            if (error);
                res.render('settings', {title: 'Settings', message: {type: 'danger', title: 'Warning', text: data }});

            if (data) {
                console.log("Settings:" + data.settings);
                var settings = data.settings;
                req.flash('settingsMessage', 'Settings successfully saved!');
                res.redirect('/settings');
            }
        });
    });
}