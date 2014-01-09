
/**
* Salt-API Rest Interface
*/

var rest = require('restler');
Salt_API = function() {};

Salt_API.prototype.login = function(host, user, pass, authtype, callback) {
  rest.post(host + '/login', {
    data: {
      'username': user,
      'password': pass,
      'eauth': authtype
    }
  }).on('complete', function(data) {
    callback(null, data.return[0].token);
  }).on('error', function(error) {
    console.log(error)
    callback(true);
  });
};

Salt_API.prototype.get_minion_grains = function(host, token, target, callback) {
  rest.get(host + '/minions/' + target, {
    headers: {
      "X-Auth-Token": token
    },
    timeout : 30000
  }).on('complete', function(data) {
    callback(null, data);
  }).on('timeout', function(error) {
    callback("timeout");
  }).on('error', function(error) {
    console.log(error)
    callback(true);
  });
};

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
    callback("timeout");
  }).on('error', function(error) {
    console.log(error)
    callback(true);
  });
};

Salt_API.prototype.get_job_results = function(host, token, jid, callback) {
  rest.get(host + '/jobs/' + jid, {
    headers: {
      "X-Auth-Token": token
    },
    timeout: 30000
  }).on('complete', function(data) {
    callback(null, data);
  }).on('timeout', function(error) {
    console.log("Error :(");
    callback("timeout");
  }).on('error', function(error) {
    callback(error);
  });
};

exports.Salt_API = Salt_API; 