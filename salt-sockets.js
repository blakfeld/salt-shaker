/**
 * Handle all sockets for salt-shaker
 */

var io = require('socket.io');
var Salt_Database = require('./Salt-Database').Salt_Database;
var Settings_Database = require('./settings-database').Settings_Database;

/**
 * Function which handles all of salt-shakers sockets.
 * @param {Object} server - express server object.
 */
module.exports = function salt_socket(server) {
    var salt_database = new Salt_Database;
    var settings_database = new Settings_Database();

    io = io.listen(server);

    // Connection
    io.on('connection', function(socket) {

        /**
         * Handle Minion Pages
         */

        // Return a list of all active minions.
        socket.on('get_minion_list', function(error) {
            salt_database.getAllMinions(function(error, data) {
                socket.emit('minion_list', {'minions': data});
            });
        });

        // Trigger a refresh of what active minions
        //  we have stored in the database.
        socket.on('refresh_minion_list', function(error) {
            salt_database.addMinionsToDatabase(function(error, data) {
                salt_database.getAllMinions(function(error, data) {
                    socket.emit('minion_list', {'minions': data});
                });
            });
        });

        // Return a list of a selected Minions Grains.
        socket.on('get_minion_grains', function(data) {
            salt_database.getMinionById(data.minion_id, function(error, data) {
                socket.emit('grain_list', {'grains': data.grains});
            });
        });

        // Trigger a refresh of what grains that minion reports.
        socket.on('refresh_minion_grains', function(data) {
            salt_database.addMinionGrains(data.minion_id, function(error, data) {
                socket.emit('grain_list',{'grains': data});
            });
        });

        /**
         * Handle Settings Pages
         */

        // Return a list of all settings.
        socket.on('get_settings', function(data) {
            var settings_type = data.type;

            settings_database.getSettings(settings_type, function(error, data) {
                if(error)
                    socket.emit('error',
                        {'errormsg': 'Unable to retrieve ' + settings_type + ' settings.'});

                socket.emit('current_settings',
                    {'settings': data.settings});
            });
        });

        // Handle new settings.
        socket.on('new_settings', function(data) {
            var settings_type = data.type;
            var new_settings = data.new_settings;

            settings_database.setSettings(settings_type, new_settings, function(error, data) {
                if (error)
                    socket.emit('error',
                        {'errormsg': 'Unable to set ' + settings_type + 'settings.'});

                socket.emit('settings_status',
                    {'success': 'Settings saved successfully!'});
            });
        });
    });
};