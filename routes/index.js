/**
 * Route Manager
 */

/**
 * Export Routing
 * @param app
 */
module.exports = function (app, passport) {
    require('./main')(app, passport);
    require('./minions')(app);
    require('./settings')(app);
};

