/**
 * Mongoose Model for storing Minion data.
 */

var minionSchema = mongoose.Schema({
  name: String,
  grains: Object
});

module.exports = mongoose.model('Minion', minionSchema);