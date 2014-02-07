/**
 * Configuration for passport to handle authentication
 */

var LocalStrategy = require('passport-local').Strategy;
var LdapStrategy = require('passport-ldapauth').Strategy;


/* Models */

var User = require('../models/userSchema');

/**
 * Export Passport Config Object
 * @param passport
 */
module.exports = function(passport) {

    /**
     * Passport Session Setup
     */

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    });

    /**
     * Local Login
     */

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function(req, username, password, done) {
            User.findOne({'local.username': username}, function(error, user) {
                if (error)
                    return done(error);

                // If no user found, return error
                if (!user || !user.validPassword(password))
                    return done(null, false,
                        req.flash('loginMessage','Incorrect Username or Password.'));

                // If all is well, return user
                return done(null, user);
            });
        }));

    /**
     * LDAP Login
     */

    passport.use('ldap-login', new LdapStrategy({

    }));
};