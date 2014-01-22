/**
 * The go-between for MongoDB and Salt-API
 */

var databaseConfig = require('./config/database');
var mongoose = require('mongoose');
var Minion = require('./models/minionSchema');
var Salt_Parser = require('./salt-parser').Salt_Parser;
var salt_parser = new Salt_Parser();

Salt_Database = function() {
  this.dbConnect = databaseConfig.server + databaseConfig.database;
};

/**
 * Function to Add whatever Minions the Server reports as active to the database.
 */
Salt_Database.prototype.addMinionsToDatabase = function(callback) {
  mongoose.connect(databaseConfig.server + databaseConfig.database);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));

  salt_parser.refreshAllMinions(function(error, data){
    if (error) {
      callback(true);
    }
    if (typeof(data.length) !== "undefined") {
      Minion.remove({});

      for (var i = 0; i < data.length; i++) {
        var minion = new Minion({"name": data[i], "grains":{}});
    
        salt_parser.refreshMinionGrains(data[i], function(error, data) {
          if (error) {
            console.log(error);
          } else {
            var name = Object.keys(data).toString();
            if (name !== "") {
              Minion.findOneAndUpdate({"name": name}, {$set: {"grains": data[name]}}, function(error) {
                if (error) callback(true, error);

                mongoose.connection.close();
              });
              //minions.update({"name": name}, {$set: {"grains": data[name]}});
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

/**
 * Function to return the known grains for a specific minion.
 * @param {Object} id - Mongo hex _id for the desired minion.
 */
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

/**
 * Function to return all Minions in the Database.
 */
Salt_Database.prototype.getAllMinions = function(callback) {
  mongoose.connect(databaseConfig.server + databaseConfig.database);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));

  //var minions = this.db.get('minions');
  console.log(typeof(Minion));
  Minion.find({}, function(error, docs) {
    if (error) console.log("Database Error: " + error);
    console.log("Database return: " + docs);
    mongoose.connection.close();
    callback(null, docs);
  });
};

/**
 * Function to return information about a specifc Minion.
 * @param {Object} id - Mongo hex _id for the desired minion.
 */ 
Salt_Database.prototype.getMinionById = function(id, callback) {
  mongoose.connect(databaseConfig.server + databaseConfig.database);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));

  Minion.findById(id, function(error, doc){
    if (error) {
      console.log(error);
      mongoose.connection.close();
      callback(true);
    } else {
      mongoose.connection.close();
      callback(null, doc);
    }
  });
};

exports.Salt_Database = Salt_Database;