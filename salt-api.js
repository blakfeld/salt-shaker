/**
* Salt-API Rest Interface
*/

var rest = require('restler');
Salt_API = function() {};

/**
 * Function to login to the Salt Server
 * @param {String} host - The host name of the Salt Server (http://example.com:8000)
 * @param {String} user - The User to attempt a login with.
 * @param {String} password - The corresponding password to attempt a login with.
 * @param {String} authtype - The Authentication Type to use (i.e. epam, ldap, etc).
 */
Salt_API.prototype.login = function(host, user, pass, authtype, callback) {
  console.log("Host: " + host + ", user: " + user + ", pass: " + pass + ", auth_type: " + authtype);
  rest.post(host + '/login', {
    data: {
      'username': user,
      'password': pass,
      'eauth': authtype
    }
  }).on('complete', function(data) {
    callback(null, data.return[0].token);
  }).on('timeout', function(error) {
    callback(true, "Connection to Salt Server timed out on login.");
  }).on('error', function(error) {
    console.log(error)
    callback(true, "Server Error on Login.");
  });
};

/**
 * Function to get a Minions grains from the server.
 * @param {String} host - The host name of the Salt Server (http://example.com:8000)
 * @param {String} token - The session token for the salt server.
 * @param {String} target - The targeted minion.
 */
Salt_API.prototype.get_minion_grains = function(host, token, target, callback) {
  rest.get(host + '/minions/' + target, {
    headers: {
      "X-Auth-Token": token
    },
    timeout : 30000
  }).on('complete', function(data) {
    callback(null, data);
  }).on('timeout', function(error) {
    callback(true, "Connection to Salt Server timed out while getting grains.");
  }).on('error', function(error) {
    console.log(error)
    callback(true, "Server Error while getting Grains.");
  });
};

/**
 * Function go run an action on a targed minion.
 * @param {String} host - The host name of the Salt Server (http://example.com:8000)
 * @param {String} token - The session token for the salt server.
 * @param {String} target - The targeted minion.
 * @param {String} func - The Function to run on the targeted Minion.
 */
Salt_API.prototype.minion_function = function(host, token, target, func, callback) {
  rest.post(host + '/minions', {
    headers: {
      "X-Auth-Token": token,
      "Accept": "application/json"
    },
    data: {
      "tgt": target,
      "fun": func
    },
    timeout: 30000
  }).on('complete', function(data) {
    callback(null, data);
  }).on('timeout', function(error) {
    callback(true, "Connection to Salt Server timed out while running function: " + func + ".");
  }).on('error', function(error) {
    console.log(error)
    callback(true, "Server Error while running function: " + func + ".");
  });
};

/**
 * Function to get a jobs return.
 * @param {String} host - The host name of the Salt Server (http://example.com:8000)
 * @param {String} token - The session token for the salt server.
 * @param {String} jid - The job ID number for the Salt-Run
 */
Salt_API.prototype.get_job_results = function(host, token, jid, callback) {
  rest.get(host + '/jobs/' + jid, {
    headers: {
      "X-Auth-Token": token
    },
    timeout: 30000
  }).on('complete', function(data) {
    callback(null, data);
  }).on('timeout', function(error) {
    callback(true, "Connection to Salt Server timed out while getting results from jid: " + jid + ".");
  }).on('error', function(error) {
    console.log(error)
    callback(true, "Server Error while getting results for jid: " + jid + ".");
  });
};

exports.Salt_API = Salt_API; 