//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');
var Passport = require('passport');
var BodyParser = require('body-parser');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');
var UserStatus = Rfr('data-access/dtc/user/user-status');

(function (module) {
    /**
     * Login API
    **/
    function LoginAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/login', UserAuthorizationType.AuthorizationAndUnAuthorizationUser, true);

    };
    Util.inherits(LoginAPI, BaseAPI);
    
    /**
     * Get required user status to run this service api
    **/
    LoginAPI.prototype.getRequiredStatus = function () {
        return UserStatus.Any;
    };

    /**
     * Register custom middleware (passport authentication)
    **/
    LoginAPI.prototype.customMiddleware = function (parentRouter) {
        parentRouter.post(this._routePath, BodyParser.json(), BodyParser.urlencoded({ extended: true }), Passport.authenticate('local'), this.doRun.bind(this));
    };

    LoginAPI.prototype.run = function (request, response, _self) {
        _self.sendSimpleSuccessReponse(response);
    };

    module.exports = LoginAPI;
})(module);
