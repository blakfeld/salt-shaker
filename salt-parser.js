/**
* Parse Information returned by Salt-API
*/

var Salt_API = require('./salt-api').Salt_API;
var salt_api = new Salt_API();
var host = 'http://saltmaster.cws.gabdcn.unt.edu:8000';
var user = 'cws';
var pass = 'ha1s1mtcfatm';
var authtype = 'pam';

Salt_Parser = function() {
};

/**
 * Function to request a list of all active minions from the Salt Server
 */
Salt_Parser.prototype.refreshAllMinions = function(callback) {
  salt_api.login(host, user, pass, authtype, function(error, token) {
    if (error) {
      console.log(error);
      callback(true);
    }
    salt_api.minion_function(host, token, '*', 'test.ping', function(error, data) {
      if (error) console.log(error);
      var jid = data.return[0].jid;
      salt_api.get_job_results(host, token, jid, function(error, data) {
        if (error) {
          console.log("Get Job Result Error: " + error);
          callback(true)
        } else {
          result = [];
          for (var key in data.return[0]) result.push(key);
          callback(null, result);
        }
      });
     });
  });
};

/**
 * Function to request all the known grains for a specific minion.
 * @param {String} minion - The Minion to target.
 */
Salt_Parser.prototype.refreshMinionGrains = function(minion, callback) {
  salt_api.login(host, user, pass, authtype, function(error, token) {
    if (error) {
      console.log(error);
      callback(true);
    }
    salt_api.get_minion_grains(host, token, minion, function(error, data) {
        callback(null, data.return[0]);
     });
  });
};

exports.Salt_Parser = Salt_Parser;