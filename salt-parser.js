/**
* Parse Information returned by Salt-API
*/

var Settings = require('./models/settingsSchema');
var Salt_API = require('./salt-api').Salt_API;
var salt_api = new Salt_API();


Salt_Parser = function() {};

/**
 * Function to request a list of all active minions from the Salt Server
 */
Salt_Parser.prototype.refreshAllMinions = function(callback) {

  Settings.findOne({"type": "server"}, function(error, data) {
    if (error) {
      callback(true, error);
    }

    var saltHost = data.settings.host;
    var saltUser = data.settings.user;
    var saltPass = data.settings.pass;
    var saltAuthType = data.settings.auth_type;

    salt_api.login(saltHost, saltUser, saltPass, saltAuthType, function(error, token) {
      if (error) {
        callback(true, error);
      }

      salt_api.minion_function(saltHost, token, '*', 'test.ping', function(error, data) {
        if (error) console.log(error);
        var jid = data.return[0].jid;

        salt_api.get_job_results(saltHost, token, jid, function(error, data) {
          if (error) {
            callback(true, error);
          }

          result = [];
          for (var key in data.return[0]) result.push(key);
          console.log(result);
          callback(null, result);
        });
      });
    });
  });
};

/**
 * Function to request all the known grains for a specific minion.
 * @param {String} minion - The Minion to target.
 */
Salt_Parser.prototype.refreshMinionGrains = function(minion, callback) {

  Settings.findOne({"type": "server"}, function(error, data) {
    if (error) {
      callback(true, error);
    }

    var saltHost = data.settings.host;
    var saltUser = data.settings.user;
    var saltPass = data.settings.pass;
    var saltAuthType = data.settings.auth_type;

    salt_api.login(saltHost, saltUser, saltPass, saltAuthType, function(error, token) {
      if (error) {
        console.log(error);
        callback(true);
      }
      salt_api.get_minion_grains(saltHost, token, minion, function(error, data) {
          callback(null, data.return[0]);
       });
    });
  });
};

exports.Salt_Parser = Salt_Parser;