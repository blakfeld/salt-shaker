/**
 * Set and get server settings.
 */

var databaseConfig = require('./config/database');
var mongoose = require('mongoose');
var Settings = require('./models/settingsSchema');

 Settings_Database = function() {
  this.dbConnect = databaseConfig.server + databaseConfig.database;
 };

/**
 * Function to Set Values in the Settings Collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc).
 * @param {Object} settings - The actual Dictionary/JSON to be sent into the database.
 */
Settings_Database.prototype.setSettings = function(type, newSettings, callback) {
  mongoose.connect(this.dbConnect);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));
  
  Settings.remove({});
  newSet = new Settings({"type": type, "settings": newSettings});

  mongoose.connection.close();
  callback(null, newSettings);
};

/**
 * Function to return all Settings for a selected Settings collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc).
 */
Settings_Database.prototype.getSettings = function(type, callback) {
  mongoose.connect(this.dbConnect);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));

  Settings.findOne({"type": type}, function(error, results) {
    if (error) {
      console.log("Unable to retreive settings: " + error);
      mongoose.connection.close();
      callback(true);
    }

    mongoose.connection.close();
    callback(null, results);
  });
};

exports.Settings_Database = Settings_Database;