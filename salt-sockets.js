/**
 * Handle all sockets for salt-shaker
 */

var io = require('socket.io');
var Salt_Database = require('./Salt-Database').Salt_Database;

/**
 * Function which handles all of salt-shakers sockets.
 * @param {Object} server - express server object.
 */
module.exports = function salt_socket(server) {
    var salt_database = new Salt_Database;

    io = io.listen(server);

    // Connection
    io.on('connection', function(socket) {

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
            salt_database.addMinionGrains(data.minion_id,
                function(error, data) {
                socket.emit('grain_list', {'grains': data});
            });
        });
    });
};