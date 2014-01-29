/**
 * Route Manager
 */

/**
 * Export Routing
 * @param app
 */
module.exports = function (app) {
    require('./main')(app);
    require('./minions')(app);
    require('./settings')(app);
};

