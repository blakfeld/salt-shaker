/**
 * Server Settings Database Object Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema

var serverSettingsSchema = new Schema({
  type: String,
  settings: Object
});

module.exports = mongoose.model('Settings', serverSettingsSchema);