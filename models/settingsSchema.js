/**
 * Server Settings Database Object Model
 */

var databaseConfig = require('../config/database');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection(databaseConfig.server, databaseConfig.database);

var settingsSchema = new Schema({
  type: String,
  settings: Object
});

module.exports = db.model('Settings', settingsSchema);