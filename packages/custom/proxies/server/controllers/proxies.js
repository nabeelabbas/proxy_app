'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Proxy = mongoose.model('Proxy'),
        _ = require('lodash');


/**
 * Find proxy by id
 */
exports.proxy = function(req, res, next, id) {
    Proxy.load(id, function(err, proxy) {
        if (err)
            return next(err);
        if (!proxy)
            return next(new Error('Failed to load proxy ' + id));
        req.proxy = proxy;
        next();
    });
};

exports.company_names = function(req, res) {
    Proxy.distinct('company_name').exec(function(err, company_names) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the proxy'
            });
        }
        res.json(company_names);
    });

}


exports.list_of_proxies = function(req, res) {
    // resetting usage to 0 once all proxies used.
    Proxy.find({usage: 0}).count({}, function(err, count) {
        if (count <= req.body.numberof_ips)
        {
            Proxy.find({usage: 1, company_name: req.body.company_name})
                    .exec(function(err, proxies) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Cannot list the proxies'
                            });
                        }
                        for (var i in proxies) {
                            Proxy.findOne({_id: proxies[i]._id}, function(err, proxy) {
                                if (err) {
                                    return next(err);
                                }
                                proxy.usage = 0;
                                proxy.save(function(err) {
                                    if (err) {
                                        return next(err);
                                    }
                                });
                            });
                        }
                    });
        }
    });
    // just searching
    Proxy
            .find({usage: 0, company_name: req.body.company_name})
            .limit(req.body.numberof_ips)
            .sort('usage')
            .select('ip_address port_num usage')
            .exec(function(err, proxies) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the proxies'
                    });
                }
                for (var i in proxies) {
                    Proxy.findOne({_id: proxies[i]._id}, function(err, proxy) {
                        if (err) {
                            return next(err);
                        }
                        proxy.usage = 1;
                        proxy.save(function(err) {
                            if (err) {
                                return next(err);
                            }
                        });
                    });
                }
                res.json(proxies);
            });
};
/**
 * Create an proxy
 */
exports.create = function(req, res) {
    var fs = require('fs');
    var appRoot = require('app-root-path');
    var path = appRoot.path + req.body.file.src;
    var array = fs.readFileSync(path).toString().split("\n");
    for (var i in array) {
        var a = array[i].split(":");
        var proxy = new Proxy;
        proxy.company_name = req.body.company_name;
        proxy.usage = 0;
        proxy.ip_address = a[0];
        proxy.port_num = a[1];
        proxy.user = req.user;
        proxy.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: 'Cannot save the proxy'
                });
            }
            //res.send('done');
        });
    }
};
/**
 * Update an proxy
 */
exports.update = function(req, res) {
    var proxy = req.proxy;
    proxy = _.extend(proxy, req.body);
    proxy.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the proxy'
            });
        }
        res.json(proxy);
    });
};
/**
 * Delete an proxy
 */
exports.destroy = function(req, res) {
    var proxy = req.proxy;
    proxy.collection.remove(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the proxy'
            });
        }
        res.json(proxy);
    });
};
/**
 * Show an proxy
 */
exports.show = function(req, res) {
    res.json(req.proxy);
};
/**
 * List of Proxys
 */
exports.all = function(req, res) {
    Proxy.find().sort('-created').populate('user', 'name username').exec(function(err, proxies) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the proxies'
            });
        }
        res.json(proxies);
    });
};
