/**
 * The go-between for MongoDB and Salt-API
 */

var Minion = require('./models/minionSchema');
var Salt_Parser = require('./salt-parser').Salt_Parser;
var salt_parser = new Salt_Parser();

Salt_Database = function() {};

/**
 * Function to Add whatever Minions the Server reports as active to the database.
 */
Salt_Database.prototype.addMinionsToDatabase = function(callback) {

  salt_parser.refreshAllMinions(function(error, data){
    if (error) {
      callback(true, error);
    }

    if (typeof(data.length) !== "undefined") {
      Minion.remove({});
      for (var i = 0; i < data.length; i++) {
        var minion = new Minion({"name": data[i], "grains":{}});
        salt_parser.refreshMinionGrains(data[i], function(error, data) {
          if (error) {
            console.log(error);
            callback(true, error);
          }
          
          var name = Object.keys(data).toString();
          if (name !== "") {
            Minion.findOneAndUpdate({"name": name}, {$set: {"grains": data[name]}}, function(error) {
              if (error) {
                callback(true, error);
              }
            });
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

/**
 * Function to return the known grains for a specific minion.
 * @param {Object} id - Mongo hex _id for the desired minion.
 */
Salt_Database.prototype.addMinionGrains = function(id, callback) {

  this.getMinionById(id, function(error, data) {
    if (error) {
      callback(true, error);
    }

    var minion_name = data.name
    salt_parser.refreshMinionGrains(minion_name, function(error, data) {
      if (error) {
        callback(true, error);
      }

      Minion.update({"name": minion_name}, {$set: {"grains": data[minion_name]}});

      callback(null, data[minion_name]);
    });
  });
};

/**
 * Function to return all Minions in the Database.
 */
Salt_Database.prototype.getAllMinions = function(callback) {

  Minion.find({}, function(error, docs) {
    if (error) {
      console.log("Database Error: " + error);
    }

    console.log("Database return: " + docs);
    callback(null, docs);
  });
};

/**
 * Function to return information about a specifc Minion.
 * @param {Object} id - Mongo hex _id for the desired minion.
 */ 
Salt_Database.prototype.getMinionById = function(id, callback) {

  Minion.findById(id, function(error, doc){
    if (error) {
      console.log(error);
      callback(true);
    } else {
      callback(null, doc);
    }
  });
};

exports.Salt_Database = Salt_Database;