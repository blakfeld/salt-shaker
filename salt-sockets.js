/**
 * Handle all sockets for salt-shaker
 */

var io = require('socket.io');
var validator = require('validator');
var Salt_Database = require('./Salt-Database').Salt_Database;
var Settings_Database = require('./Settings-Database').Settings_Database;

/**
 * Function which handles all of salt-shakers sockets.
 * @param {Object} server - express server ojbect.
 */
module.exports = function salt_socket(server) {
  var salt_database = new Salt_Database;
  var settings_database = new Settings_Database;

  // Initilize sockets, set up some compression and minification.
  io = io.listen(server);

  // io.enable('browser client minification');  // send minified client
  // io.enable('browser client etag');          // apply etag caching logic based on version number
  // io.enable('browser client gzip');          // gzip the file
  // io.set('log level', 1);                    // reduce logging
  // io.set('transports', [                     // enable all transports (optional if you want flashsocket)
  //     'websocket'
  //   , 'flashsocket'
  //   , 'htmlfile'
  //   , 'xhr-polling'
  //   , 'jsonp-polling'
  // ]);


  // Connection
  io.on('connection', function(socket) {

    // Return a list of all active minions.
    socket.on('get_minion_list', function(error) {
      salt_database.getAllMinions(function(error, data) {
        socket.emit('minion_list', {'minions': data});
      });
    });

    // Trigger a refresh of what active minions we have stored in the database.
    socket.on('refresh_minion_list', function(error) {
      salt_database.addMinionsToDatabase(function(error, data) {
        salt_database.getAllMinions(function(error, data) {
          socket.emit('minion_list', {'minions': data});
        });
      });
    });

    // Return a list of a selected Minions Grains.
    socket.on('get_minion_grains', function(data) {
      salt_database.getMinionById(data.minion_id, function(error, data){
        socket.emit('grain_list', {'grains': data.grains});
      });
    });

    // Trigger a refresh of what grains that minion reports.
    socket.on('refresh_minion_grains', function(data) {
      salt_database.addMinionGrains(data.minion_id, function(error, data){ 
        socket.emit('grain_list', {'grains': data});
      });
    });

    // Get Server Settings
    socket.on('get_settings', function(data) {
      settings_database.getSettings(data.settingsType, function(error, data){
        socket.emit('settings', {'settings': data});
      });
    });

    // Set Server Settings
    socket.on('set_settings', function(data) {
      if (validator.isURL(data.settings.host)) {
        if (data.settings.user == "" || data.settings.pass == "") {
          socket.emit('settings', {'error': "Username and Password must be provided."});
        } else {
          settings_database.setSettings(data.settingsType, data.settings, function(error, data) {
            if (error) {
              console.log("Socket Error :( " + error)
            }
            socket.emit('settings', {'success': "Changes saved successfully!"});
          });
        }
      } else {
        socket.emit('settings', {'error': "Host must be a valid URL."});
      }
    });
  });
};