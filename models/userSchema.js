/**
 * Mongoose Schema for User Log ins using Passport
 */

var databaseConfig = require('../config/database');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.createConnection(databaseConfig.server,
    databaseConfig.database);

var userSchema = new Schema({
    local: {
        username: String,
        password: String
    },
    role: String
});

/* Methods */

/**
 * Generate Basic Password Hash
 * @param {String} password - Password to hash
 * @return {String} Hashed Password
 */
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

/**
 * Check if entered Password is valid.
 * @this password
 * @param {String} password - Password to Check
 * @return {Boolean} - True if valid.
 */
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

/**
 * Export UserSchema Object
 * @type {*|Model}
 */
module.exports = db.model('Users', userSchema);
