/**
 * Set and get server settings
 */

 var monk = require('monk');
 var ObjectID = require('mongodb').ObjectID;

 Settings_Database = function() {
  this.db=monk('localhost:27017/salt-shaker-database');
 };

/**
 * Function to Set Values in the Settings Collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc)
 * @param {Object} settings - The actual Dictionary/JSON to be sent into the database
 */
Settings_Database.prototype.setSettings = function(type, newSettings, callback) {
  var settings = this.db.get('settings');
  settings.remove({"type": type});
  settings.insert({"type": type, "settings": newSettings})
  callback(null, newSettings);
};

/**
 * Function to return all Settings for a selected Settings collection
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc)
 */
Settings_Database.prototype.getSettings = function(type, callback) {
  var settings = this.db.get('settings');
  settings.findOne({"type": type}, function(error, results) {
    if (error) {
      console.log("Unable to retreive settings: " + error);
      callback(true);
    }
    callback(null, results);
  });
};

exports.Settings_Database = Settings_Database;