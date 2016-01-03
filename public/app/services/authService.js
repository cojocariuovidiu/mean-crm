angular.module('authService', []).

/**
Authfactory to login and get information
@$http communication with api
@$q to return promise objects
@AuthToken to manage tokens
@return factory
**/

factory('Auth', function ($http, $q, AuthToken) {
    var authFactory = {};

    //handle login
    authFactory.login = function (username, password) {
        return $http.post('/api/authenticate', {
            userName: username,
            password: password
        }).success(function (data) {
            AuthToken.setToken(data.token);
            return data;
        });
    }

    //handle logout
    authFactory.logout = function () {
        AuthToken.setToken();
    }

    //check user logged in
    authFactory.isLoggedIn = function () {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    }

    //get user info
    authFactory.getUser = function () {
        if (AuthToken.getToken()) {
            return $http.get('/api/me', {
                cache: true
            });
        } else {
            return $q.reject({
                'message': 'User has no token'
            });
        }
    }

    //return authfactory object
    return authFactory;
}).

//factory for handling tokens
//inject $window to store client side
factory('AuthToken', function ($window) {

    var authTokenFactory = {};

    //get the token
    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('token');
    };

    //set or clear the token
    authTokenFactory.setToken = function (token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    }
    return authTokenFactory;
}).

//application configuration to integrate token into requests
factory('AuthInterceptor', function ($q, $location, AuthToken) {
    var interceptorFactory = {};

    interceptorFactory.request = function (config) {
        //grab the token
        var token = AuthToken.getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    }

    interceptorFactory.responseError = function (response) {
        if (response.status == 403) {
            AuthToken.setToken();
            $location.path('/login');
        }
        return $q.reject(response);
    }

    //redirect if a token doesn't authenticate
    return interceptorFactory;
});
