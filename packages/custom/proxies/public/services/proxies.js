'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.proxies').factory('Proxies', ['$resource',
    function($resource) {
        return $resource('proxies/:proxyId', {
            proxyId: '@_id'
        }, {update: {method: 'PUT'},
            list: {method: 'POST', url: '/proxies/list', isArray: true},
            get_copmanies: {method: 'GET', url: '/proxies/company_names', isArray: true}

        });
    }
]);


//var app = angular.module('mean.proxies');
//app.factory('Proxies', ['$resource', function($resource) {
//        var service = {};
//        service.get_proxies = $resource('/get_list_of_proxies', null,
//    {
//        'query': { method:'POST' }
//    });
//    return service;
//}]);

