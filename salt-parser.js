/**
* Parse Information returned by Salt-API
*/

var monk = require('monk');
var Salt_API = require('./salt-api').Salt_API;
var salt_api = new Salt_API();


Salt_Parser = function() {
  this.db=monk('localhost:27017/salt-shaker-database');
};

/**
 * Function to request a list of all active minions from the Salt Server
 */
Salt_Parser.prototype.refreshAllMinions = function(callback) {
  var settings = this.db.get('settings');
  settings.findOne({"type": "server"}, function(error, data) {
    var saltHost = data.settings.host;
    var saltUser = data.settings.user;
    var saltPass = data.settings.pass;
    var saltAuthType = data.settings.auth_type;

    salt_api.login(saltHost, saltUser, saltPass, saltAuthType, function(error, token) {
      if (error) {
        console.log(error);
        callback(true);
      }

      salt_api.minion_function(saltHost, token, '*', 'test.ping', function(error, data) {
        if (error) console.log(error);
        var jid = data.return[0].jid;

        salt_api.get_job_results(saltHost, token, jid, function(error, data) {
          if (error) {
            console.log("Get Job Result Error: " + error);
            callback(true)
          } else {
            result = [];
            for (var key in data.return[0]) result.push(key);
            console.log(result);
            callback(null, result);
          }
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
  var settings = this.db.get('settings');
  settings.findOne({"type": "server"}, function(error, data) {
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