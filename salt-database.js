
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
    if (typeof(data.length) !== "undefined"){
      for (var i = 0; i < data.length; i++) {
        salt_parser.refreshMinionGrains(data[i], function(error, data) {
          if (error) {
            console.log(error);
          } else {
            console.log(typeof(data));
            var name = Object.keys(data).toString();
            console.log(data[name]);
            if (name !== "") {
              minions.insert({"name": name, "grains": data[name]});
            }
          }
        });
      }
      callback(null, data);
    }
  });
};

Salt_Database.prototype.getAllMinions = function(callback) {
  var minions = this.db.get('minions');
  minions.find({}, function(error, docs) {
    console.log(docs);
    callback(null, docs);
  });
};

Salt_Database.prototype.getMinionById = function(id, callback) {
  var minions = this.db.get('minions');
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