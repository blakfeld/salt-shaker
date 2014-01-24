/**
 * Set and get server settings.
 */

var validator = require('validator');
var Settings = require('./models/settingsSchema');

 Settings_Database = function() {};

/**
 * Function to Set Values in the Settings Collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc).
 * @param {Object} settings - The actual Dictionary/JSON to be sent into the database.
 */
Settings_Database.prototype.setSettings = function(type, newSettings, callback) {

    if(validator.isURL(newSettings.host)) {
      if(newSettings.user == "" || newSettings.pass == "") {
        callback(true, "Username and Password must be provided");
      }

      Settings.remove({});
      newSet = new Settings({"type": type, "settings": newSettings});
    
    } else {
      callback(true, "Host must be a URL");
    }
    
    callback(null, newSettings);
};

/**
 * Function to return all Settings for a selected Settings collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc).
 */
Settings_Database.prototype.getSettings = function(type, callback) {

    Settings.findOne({"type": type}, function(error, results) {
      if (error) {
        callback(true, "Unable to retreive from database.");
      }

      callback(null, results);
    });

};

module.exports = Settings_Database;