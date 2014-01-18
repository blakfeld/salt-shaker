
/**
 * The go-between for MongoDB and Salt-API
 */

var monk = require('monk')
var ObjectID = require('mongodb').ObjectID
var Salt_Parser = require('./salt-parser').Salt_Parser;
var salt_parser = new Salt_Parser();

 Salt_Database = function() {
  this.db = monk('localhost:27017/salt-shaker-database');
 };

Salt_Database.prototype.addMinionsToDatabase = function(callback) {
  var minions = this.db.get('minions');

  salt_parser.refreshAllMinions(function(error, data){
    if (error) {
      callback(true);
    }
    if (typeof(data.length) !== "undefined") {
      minions.drop();

      for (var i = 0; i < data.length; i++) {
        minions.insert({"name": data[i], "grains":{}})
        salt_parser.refreshMinionGrains(data[i], function(error, data) {
          if (error) {
            console.log(error);
          } else {
            var name = Object.keys(data).toString();
            if (name !== "") {
              minions.update({"name": name}, {$set: {"grains": data[name]}});
            }
          }
        });
      }
      callback(null, data);
    } else {
      console.log("Data returned null");
      callback("Data returned null");
    }
  });
};

Salt_Database.prototype.addMinionGrains = function(id, callback) {
  var minions = this.db.get('minions');
  this.getMinionById(id, function(error, data) {
    var minion_name = data.name
    salt_parser.refreshMinionGrains(minion_name, function(error, data) {
      minions.update({"name": minion_name}, {$set: {"grains": data[minion_name]}});
      callback(null, data[minion_name]);
    });
  });
};

Salt_Database.prototype.getAllMinions = function(callback) {
  var minions = this.db.get('minions');
  minions.find({}, function(error, docs) {
    callback(null, docs);
  });
};

Salt_Database.prototype.getMinionById = function(id, callback) {
  var minions = this.db.get('minions');
  console.log(id);
  minions.findById(ObjectID.createFromHexString(id), function(error, doc){
    if (error) {
      console.log(error);
      callback(true);
    } else {
      callback(null, doc);
    }
  });
};

 exports.Salt_Database = Salt_Database;