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
     * Create new public message api
    **/
    function CreateAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/create', UserAuthorizationType.AuthorizationUser);

    };
    Util.inherits(CreateAPI, BaseAPI);


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
            createdWho: request.user.mobile
        });


        PublicMessageDTC.getInstance().createNew(publicMessageDTO, function (errorCode, data) {
            if (!Util.isNullOrUndefined(errorCode)) {
                _self.sendErrorResponse(response, errorCode, data);
            } else {
                _self.sendSimpleSuccessReponse(response);
            }
        });
    };

    module.exports = CreateAPI;
})(module);
