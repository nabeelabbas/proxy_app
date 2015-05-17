'use strict';

angular.module('mean.proxies').controller('ProxiesController', ['$scope', '$stateParams', '$location', 'Global', 'Proxies',
    function($scope, $stateParams, $location, Global, Proxies) {
        $scope.global = Global;
        $scope.hasAuthorization = function(proxy) {
            if (!proxy || !proxy.user)
                return false;
            return $scope.global.isAdmin || proxy.user._id === $scope.global.user._id;
        };
        $scope.file = "";
        $scope.companies = '';
        
        $scope.create = function() {
            
                var proxy = new Proxies({
                    file:  $scope.file,
                    company_name: this.company_name
                });
                proxy.$save(function(response) {
                    $location.path('proxies');
                });
        };
        
        $scope.uploadFileProxyCallback = function(file) {
           $scope.file = file;
        };
        
       var get_companies = function() {
         Proxies.get_copmanies({
            }, function(companies) {
                $scope.companies = companies;
                console.log($scope.companies)
                 //$location.path('filtered');
            })   
        };
        get_companies();
        


        $scope.list = function() {
            console.log($scope)
            Proxies.list({
                
                numberof_ips: $scope.number_of_ips,
                company_name: $scope.name_of_company
                
            }, function(proxies) {
                $scope.list_of_proxies = proxies;
                console.log($scope.list_of_proxies)
                 //$location.path('filtered');
            });
        };


        $scope.deletePhoto = function(photo) {
            var index = $scope.proxies.images.indexOf(photo);
            $scope.proxies.images.splice(index, 1);
        };

        $scope.remove = function(proxy) {
            if (proxy) {
                proxy.$remove(function(response) {
                    for (var i in $scope.proxies) {
                        if ($scope.proxies[i] === proxy) {
                            $scope.proxies.splice(i, 1);
                        }
                    }
                    $location.path('proxies');
                });
            } else {
                $scope.proxy.$remove(function(response) {
                    $location.path('proxies');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var proxy = $scope.proxy;
                if (!proxy.updated) {
                    proxy.updated = [];
                }
                proxy.updated.push(new Date().getTime());

                proxy.$update(function() {
                    $location.path('proxies/' + proxy._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Proxies.query(function(proxies) {
                $scope.proxies = proxies;
            });
        };

        $scope.findOne = function() {
            Proxies.get({
                proxyId: $stateParams.proxyId
            }, function(proxy) {
                $scope.proxy = proxy;
            });
        };
    }
]);
