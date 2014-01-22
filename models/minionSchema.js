/**
 * Minion Database Object Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema

var minionSchema = new Schema({
  name: String,
  grains: Object  
});

module.exports = mongoose.model('Minion', minionSchema);