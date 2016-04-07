//
// Load required module
//
// External library
var Express = require('express');
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');

(function (module) {
    
    var _routePath = null;                          // Path for API
    var _requiredAuthorizationType = null;          // Required Authorization type to invoke this API
    var _route = null;                              // Express router to handle request

    /**
     * Create API object to handle request and response
    **/
    function BaseAPI(routeObject, routePath, requiredAuthorizationType) {

        _routePath = routerPath;
        _requiredAuthorizationType = requiredAuthorizationType;
        
        // Register new express route object to handle api path
        _route = Express.Router();
        _route.post('/', this.doRun);
        
        // Add this router to parrent router
        routeObject.use(_routePath, _route);
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
     * @return path for this api (relative path)
    **/
    BaseAPI.prototype.getAPIRoute = function () {
        
        if (Util.isNullOrUndefined(_routePath)) {
            throw 'API Route has not been decleared.';
        };


        return _routePath;
    };
    
    /**
     * Run processing function with checking required authorization
    **/
    BaseAPI.prototype.doRun = function (request, response) {

        // Validate user authorization first
        var userAuthorizationType = request.body.userAuthorizationType;
        var requiredAuthorizationType = this.getRequiredAuthorization();
        if (userAuthorizationType != requiredAuthorizationType) {
            throw 'Access Denined.';
        };

        this.run(request, response);
    };
    
    /**
     * Main function for processing services
     * Override this function for each API
    **/
    BaseAPI.prototype.run = function (request, response) {

    };

    module.exports = BaseAPI;
})(module); 