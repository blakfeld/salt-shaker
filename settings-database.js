/**
 * Set and get server settings.
 */

var validator = require('validator');
var Settings = require('./models/settingsSchema');

Settings_Database = function() {};

/**
 * Function to Set Values in the Settings Collection.
 * @param {String} type - The type of settings
 *  (i.e. settings for the Server, App Settings, Login, etc).
 * @param {Object} newSettings - The actual Dictionary/JSON
 *  to be sent into the database.
 * @param {Function} callback - Callback function.
 */
Settings_Database.prototype.setSettings =
    function(type, newSettings, callback) {

    if (validator.isURL(newSettings.host)) {
        if (newSettings.user == '' || newSettings.pass == '' || newSettings.pass == 'undefined') {
            callback(true, 'Username and Password must be provided');
        }

        Settings.findOne({'type': type}, function(error, settings) {
            if(error)
                callback(true, "Unable to talk to database.");

            if(!settings) {

                var newSet = new Settings({'type': type, 'settings': newSettings});

                newSet.save(function(error) {
                    if (error) {
                        callback(true, 'Unable to save Settings');
                    }

                    callback(null, newSet);
                });

            } else {
                Settings.findOneAndUpdate({'type': type},
                    {$set: {'settings': newSettings}},
                function(error) {
                    if (error)
                        callback(true, "Unable to update settings");
                });
            }
        });

    } else {
        callback(true, 'Host must be a URL');
    }

    callback(null, newSettings);
};

/**
 * Function to return all Settings for a selected Settings collection.
 * @param {String} type - The type of settings
 *  (i.e. settings for the Server, App Settings, Login, etc).
 * @param {Function} callback - Callback function.
 */
Settings_Database.prototype.getSettings = function(type, callback) {

    Settings.findOne({'type': type}, function(error, results) {
        if (error) {
            callback(true, 'Unable to retrieve from database.');
        }

        callback(null, results);
    });

};

/**
 * Export Settings_Database Object
 * @type {Settings_Database}
 */
module.exports = Settings_Database;
