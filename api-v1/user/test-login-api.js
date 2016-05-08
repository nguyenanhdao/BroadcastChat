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
    function TestLogin(parentRouter) {

        BaseAPI.call(this, parentRouter, '/test-login', UserAuthorizationType.AuthorizationAndUnAuthorizationUser);

    };
    Util.inherits(TestLogin, BaseAPI);
    
    /**
     * Get required user status to run this service api
    **/
    TestLogin.prototype.getRequiredStatus = function () {
        return UserStatus.Any;
    };
    
    TestLogin.prototype.run = function (request, response, _self) {
        if (request.user != null) {
            _self.sendSimpleSuccessReponse(response);
        } else {
            _self.sendErrorResponse(response, 'userLoginTestLoginNotLogin');
        }
    };

    module.exports = TestLogin;
})(module);
