//
// Load required module
//
// External library
var Express = require('express');
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');
var BodyParser = require('body-parser');
var Async = require('async');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var ResponseCode = Rfr('api-v1/response-code.js');
var SystemLog = Rfr('system-log.js');
var UserStatus = Rfr('data-access/dtc/user/user-status.js');
var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');

(function (module) {
    /**
     * Create API object to handle request and response
     * @param parentRouter Parent Router
    **/
    function BaseAPI(parentRouter, routePath, requiredAuthorizationType, isCustomMiddleware) {

        this._routePath = routePath;
        this._requiredAuthorizationType = requiredAuthorizationType;

        if (isCustomMiddleware) {

            this.customMiddleware(parentRouter);

        } else {
            // Register new express route object to handle api path
            parentRouter.post(this._routePath, BodyParser.json(), BodyParser.urlencoded({ extended: true }), this.doRun.bind(this));
        }
    };

    /**
     * Methods to inject custom middleware function for each API
     * @param parentRouter Parent Router
    **/
    BaseAPI.prototype.customMiddleware = function (parentRouter) {

        throw 'CustomMiddleware function is not implemented';

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
     * Get required user status to run this API service
     * @return required user status t run this API service
    */
    BaseAPI.prototype.getRequiredStatus = function () {
        
        throw 'getRequiredStatus is not implemented';
        
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
        var _self = this;
        
        Async.waterfall([
            // Validate user authorization first (login or not login)
            function (innerCallback) {
                var userAuthorizationType = Util.isNullOrUndefined(request.user) ? null : request.user.authorizationType;
                if (!UserAuthorizationType.isEqual(userAuthorizationType, _self.getRequiredAuthorization())) {
                    innerCallback('accessDenied');
                    return;
                };
                
                innerCallback(null);
            },
            
            // Validate user status
            function (innerCallback) {
                var requiredUserStatus = _self.getRequiredStatus();
                var userId = Util.isNullOrUndefined(request.user) ? null : request.user.id;
                
                if (Util.isNullOrUndefined(userId) && requiredUserStatus === UserStatus.Any) {
                    innerCallback(null);
                } else if (Util.isNullOrUndefined(userId)) {
                    innerCallback('accessDenied');
                } else {
                    UserDTC.getInstance().getById(userId, function (error, userDTO) {
                        if (!Util.isNullOrUndefined(error)) {
                            SystemLog.getInstance().error('Internal server error', error);
                            innerCallback('internalError');
                            return;
                        };
                        
                        if (!UserStatus.isLegal(userDTO.status, requiredUserStatus)) {
                            innerCallback('ilegalUserStatus');
                            return;
                        };
                        
                        innerCallback(null);
                    });
                }
            }
        ], function (error) {
            // Check for error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.getInstance().error('Internal server error', error);
                _self.sendErrorResponse(response, 'internalError');
                return;
            };
            
            
            // Execute service api
            try {
                _self.run(request, response, _self);
            } catch (exception) {
                SystemLog.getInstance().error('Internal server error', exception);
                _self.sendErrorResponse(response, 'internalError');
            }
        });
    };

    /**
     * Main function for processing services
     * Override this function for each API
    **/
    BaseAPI.prototype.run = function (request, response) {

        throw 'Run function of BaseAPI is not implemented';

    };

    /**
     * Send error response
    **/
    BaseAPI.prototype.sendErrorResponse = function (response, code, data) {
        response.send({
            code: code,
            message: ResponseCode.getMessage(code),
            isError: true,
            data: data
        });
        response.end();
    };

    /**
     * Send success response
    **/
    BaseAPI.prototype.sendSuccessResponse = function (response, code, data) {
        response.send({
            code: code,
            message: ResponseCode.getMessage(code),
            isError: false,
            data: data
        });
        response.end();
    };

    /**
     * Send simple success reponse to client-side
    **/
    BaseAPI.prototype.sendSimpleSuccessReponse = function (response) {
        response.send({
            code: 'ok',
            message: ResponseCode.getMessage('ok'),
            isError: false
        });
        response.end();
    };


    module.exports = BaseAPI;
})(module);
