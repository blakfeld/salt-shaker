#!/usr/bin/env node
/**
 * This is a utility for when you lock yourself out :)
 * @type {exports}
 */

var User = require('../models/userSchema.js');
var program = require('commander');

/**
 * User Commander to get CLI flags
 */
program.option('-U, --user <user>', 'The new local admin Username');
program.option('-P, --pass <pass>', 'The new local admin Password');
program.parse(process.argv);

//var createUser = function(username, password, done) {}

newUser = new User();

newUser.local.username = program.user;
newUser.local.password = newUser.generateHash(program.pass);
newUser.role = 'admin';

newUser.save(function(err) {
    if (err) {
        console.log("Unable to save. %s", err);
        process.exit(1);
    }
    console.log("%s successfully saved!", program.user);
    process.exit(0);
});