
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

Salt_Parser.prototype.refreshAllMinions = function(callback) {
  salt_api.login(host, user, pass, authtype, function(error, token) {
    if (error) {
      console.log(error);
      callback(true);
    }
    salt_api.minion_function(host, token, '*', 'test.ping', function(error, data) {
      if (error) console.log(error);
      callback(null, data.return[0].minions);
     });
  });
};

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