/**
 * Set and get server settings
 */

 var monk = require('monk');
 var ObjectID = reqiure('mongodb').ObjectID;

 Settings_Database = function() {
  this.db=monk('localhost:27017/salt-shaker-database');
 };

/**
 * Function to Set Values in the Settings Collection.
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc)
 * @param {Object} settings - The actual Dictionary/JSON to be sent into the database
 */
Settings_Database.prototype.setSettings = function(type, settings, callback) {
  var settings = this.db.get('settings');

  minions.insert({"type": type, "settings": settings}, function(error){
    if (error) {
      console.log("Unable to add settings for " + type + ": " + error);
      callback(true);
    }
    callback(null, settings);
  });
};

/**
 * Function to return all Settings for a selected Settings collection
 * @param {String} type - The type of settings (i.e. settings for the Server, App Settings, Login, etc)
 */
Settings_Database.prototype.getAllSettings = function(type, callback) {
  var settings = this.db.get('settings');
  
  if (settings.exists()) {
    settings.find({}, function(error, results) {
      if (error) {
        console.log("Unable to retreive settings: " + error);
        callback(true);
      }
      callback(null, results[type]);
    });
  } else {
    callback(null, "none");
  } 
};

exports.Settings_Database = Salt_Database;