/**
 * Minion Database Object Model
 */

var databaseConfig = require('../config/database');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection(databaseConfig.server, databaseConfig.database);


var minionSchema = new Schema({
  name: String,
  grains: Object  
});

module.exports = db.model('Minion', minionSchema);