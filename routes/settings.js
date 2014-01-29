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

            settings = data.settings;
            res.render('settings', {title: 'Settings', host: settings.host, user: settings.user, password: settings.pass, auth_type: settings.auth_type, message: ''});
        });
    });

    app.post('/settings', function (req, res) {

        newSettings = {'host': req.body.host, 'user': req.body.user, 'pass': req.body.pass, 'auth_type': req.body.auth_type};

        settings_database.setSettings('server', newSettings, function (error, data) {
            if (error)
                res.render('settings', {title: 'Settings', message: {type: 'danger', title: 'Warning', text: data }});

            settings = data;
            res.render('settings', {title: 'Settings', host: settings.host, user: settings.user, password: settings.pass, auth_type: settings.auth_type, message: { type: 'success', title: 'Success', text: 'Changes saved successfully!' }});
        });
    });
}