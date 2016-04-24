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
     * Logout API
    **/
    function LogoutAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/logout', UserAuthorizationType.AuthorizationAndUnAuthorizationUser);

    };
    Util.inherits(LogoutAPI, BaseAPI);
    
    /**
     * Get required user status to run this service api
    **/
    LogoutAPI.prototype.getRequiredStatus = function () {
        return UserStatus.Any;
    };

    /**
     * Logout processing function
    **/
    LogoutAPI.prototype.run = function (request, response, _self) {
        request.logout();
        _self.sendSimpleSuccessReponse(response);
    };

    module.exports = LogoutAPI;
})(module);
