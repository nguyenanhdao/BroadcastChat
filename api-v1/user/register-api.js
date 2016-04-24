//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');
var UserStatus = Rfr('data-access/dtc/user/user-status.js');

(function (module) {
    /**
     * Register new user API
    **/
    function RegisterAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/register', UserAuthorizationType.UnAuthorizationUser);

    };
    Util.inherits(RegisterAPI, BaseAPI);

    /**
     * Get required user status to run this service api
    **/
    RegisterAPI.prototype.getRequiredStatus = function () {
        return UserStatus.Any;
    };

    /**
     * Register new user
    **/
    RegisterAPI.prototype.run = function (request, response, _self) {
        var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
        var UserDTO = Rfr('data-access/dtc/user/user-dto.js');

        var userDTO = new UserDTO({
            mobile: request.body.mobile,
            password: request.body.password,
            fullName: request.body.fullName,
            createdWhen: new Date(),
            authorizationType: UserAuthorizationType.AuthorizationUser,
            
            // FIX-ME
            // By default, create user has status as WaitForActivation
            // But in dev mode, just let them active user
            status: UserStatus.ActiveUser
        });

        UserDTC.getInstance().createNew(userDTO, function (errorCode, data) {
            if (!Util.isNullOrUndefined(errorCode)) {
                _self.sendErrorResponse(response, errorCode, data);
            } else {
                data.password = '';
                _self.sendSuccessResponse(response, 'ok', data);
            }
        });
    };

    module.exports = RegisterAPI;
})(module);
