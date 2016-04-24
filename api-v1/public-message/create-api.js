//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');
var UserStatus = Rfr('data-access/dtc/user/user-status');

(function (module) {
    /**
     * Create new public message api
    **/
    function CreateAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/create', UserAuthorizationType.AuthorizationUser);

    };
    Util.inherits(CreateAPI, BaseAPI);
    
    /**
     * Get required user status to run this service api
    */
    CreateAPI.prototype.getRequiredStatus = function () {
        return UserStatus.ActiveUser;
    };

    /**
     * Create new public message api
    **/
    CreateAPI.prototype.run = function (request, response, _self) {
        var PublicMessageDTC = Rfr('data-access/dtc/public-message/public-message-dtc.js');
        var PublicMessageDTO = Rfr('data-access/dtc/public-message/public-message-dto.js');

        var publicMessageDTO = new PublicMessageDTO({
            message: request.body.message,
            longitude: request.body.longitude,
            latitude: request.body.latitude,
            createdWhen: new Date(),
            createdWho: request.user.id
        });


        PublicMessageDTC.getInstance().createNew(publicMessageDTO, function (errorCode, data) {
            if (!Util.isNullOrUndefined(errorCode)) {
                _self.sendErrorResponse(response, errorCode, data);
            } else {
                _self.sendSuccessResponse(response, 'ok', data);
            }
        });
    };

    module.exports = CreateAPI;
})(module);
