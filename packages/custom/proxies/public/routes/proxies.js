'use strict';

//Setting up route
angular.module('mean.proxies').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all proxies', {
        url: '/proxies',
        templateUrl: 'proxies/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('filtered proxies', {
        url: '/filtered',
        templateUrl: 'proxies/views/filtered.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create proxy', {
        url: '/proxies/create',
        templateUrl: 'proxies/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('list proxy', {
        url: '/proxies/list',
        templateUrl: 'proxies/views/list_proxy.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit proxy', {
        url: '/proxies/:proxyId/edit',
        templateUrl: 'proxies/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('proxy by id', {
        url: '/proxies/:proxyId',
        templateUrl: 'proxies/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
