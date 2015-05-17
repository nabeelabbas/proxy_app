'use strict';

var proxies = require('../controllers/proxies');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.proxy.user.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function(Articles, app, auth) {

    app.route('/proxies')
            .get(proxies.all)
            .post(auth.requiresLogin, proxies.create);
    app.route('/proxies/list')
            .post(auth.requiresLogin, proxies.list_of_proxies);
    app.route('/proxies/company_names')
            .get(auth.requiresLogin, proxies.company_names);
    app.route('/proxies/:proxyId')
            .get(auth.isMongoId, proxies.show)
            .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, proxies.update)
            .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, proxies.destroy);

    // Finish with setting up the proxyId param
    app.param('proxyId', proxies.proxy);
};