//
// Load required module
//
// External library
var Express = require('express');
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');
var BodyParser = require('body-parser');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');

(function (module) {
    /**
     * Create API object to handle request and response
     * @param parentRouter Parent Router
    **/
    function BaseAPI(parentRouter, routePath, requiredAuthorizationType) {

        this._routePath = routePath;
        this._requiredAuthorizationType = requiredAuthorizationType;
        
        // Register new express route object to handle api path
        parentRouter.post(this._routePath, BodyParser.json(), BodyParser.urlencoded({ extended: true }), this.doRun.bind(this));
    };
    
    /**
     * Get required authorization to run API service
     * @return Return required authorization
    **/
    BaseAPI.prototype.getRequiredAuthorization = function () {
        
        if (Util.isNullOrUndefined(this._requiredAuthorizationType)) {
            throw 'Authorization Type for API has not been decleared.';
        };
        
        // By default, return authorized user
        return this._requiredAuthorizationType;
        
    };
    
    /**
     * Get APIRoute
     * @return path for this api (relative path)
    **/
    BaseAPI.prototype.getAPIRoute = function () {
        
        if (Util.isNullOrUndefined(this._routePath)) {
            throw 'API Route has not been decleared.';
        };


        return this._routePath;
    };
    
    /**
     * Run processing function with checking required authorization
    **/
    BaseAPI.prototype.doRun = function (request, response) {
        // Validate user authorization first
        var userAuthorizationType = request.body.userAuthorizationType;
        if (!UserAuthorizationType.isEqual(userAuthorizationType, this.getRequiredAuthorization())) {
            throw 'Access Denined.';
        };

        this.run(request, response);
    };
    
    /**
     * Main function for processing services
     * Override this function for each API
    **/
    BaseAPI.prototype.run = function (request, response) {

        throw 'Run function of BaseAPI is not implemented';

    };

    module.exports = BaseAPI;
})(module); 