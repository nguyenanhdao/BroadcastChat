//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');

(function (module) {
    
    var _apiRoute = null;                           // API Route
    var _requiredAuthorizationType = null;          // Required Authorization type to invoke this API

    /**
     * Create API object to handle request and response
    **/
    function BaseAPI(apiRoute, requiredAuthorizationType) {

        _apiRoute = apiRoute;
        _requiredAuthorizationType = requiredAuthorizationType;

    };
    
    /**
     * Get required authorization to run API service
     * @return Return required authorization
    **/
    BaseAPI.prototype.getRequiredAuthorization = function () {
        
        if (Util.isNullOrUndefined(_requiredAuthorizationType)) {
            throw 'Authorization Type for API has not been decleared.';
        };
        
        // By default, return authorized user
        return _requiredAuthorizationType;
        
    };
    
    /**
     * Get APIRoute
    **/
    BaseAPI.prototype.getAPIRoute = function () {
        
        if (Util.isNullOrUndefined(_apiRoute)) {
            throw 'API Route has not been decleared.';
        };


        return _apiRoute;
    };
    
    /**
     * Main function for processing services
     * @return Always return promise
    **/
    BaseAPI.prototype.run = function (request, response) {
        
        return Promise.resolve();
        
    };

    module.exports = BaseAPI;
})(module); 