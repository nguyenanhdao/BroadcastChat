//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');


(function (module) {
    /**
     * Register new user API
    **/
    function RegisterAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/register', UserAuthorizationType.UnAuthorizationUser);

    };
    Util.inherits(RegisterAPI, BaseAPI);


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
            authorizationType: UserAuthorizationType.AuthorizationUser
        });

        UserDTC.getInstance().createNew(userDTO, function (errorCode, data) {
            if (!Util.isNullOrUndefined(errorCode)) {
                _self.sendErrorResponse(response, errorCode, data);
            } else {
                _self.sendSimpleSuccessReponse(response);
            }
        });
    };

    module.exports = RegisterAPI;
})(module);
