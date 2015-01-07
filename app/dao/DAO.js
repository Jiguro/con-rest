(function DAOScope(angular, clazz, undefined) {
    'use strict';

    var app = angular.module('con-rest');

    app.factory('DAO', function DAOScope($http, $q) {
        function DAO() {
            this.private = {
                createConfig: function createConfig(method, url, data) {
                    var config = {
                        method: method,
                        url: url
                    };
                    if (data !== undefined && method === 'GET') {
                        config.params = data;
                    } else {
                        config.data = data;
                    }
                    return config;
                },
                exposeData: function exposeData(deferred) {
                    // The request should set the attributes so the pointer will be to the same
                    // model. This will allow the other consumers of this model to receive the update
                    // aswell.
                    return function exposeData(response) {
                        deferred.resolve(response.data);
                    };
                },
                request: function request(method, url, data) {
                    var deferred = $q.defer();
                    this.private.requestRaw(method, url, data)
                        .then(this.private.exposeData(deferred))
                    return deferred.promise;
                },
                requestRaw: function requestRaw(method, url, data) {
                    return $http(this.private.createConfig(method, url, data));
                }
            };
        }

        var DAOSingleton = clazz('DAO', DAO);
        return new DAOSingleton();
    });
}(window.angular, window.enofjs.clazz));