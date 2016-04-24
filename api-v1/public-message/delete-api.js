//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Async = require('async');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');
var UserStatus = Rfr('data-access/dtc/user/user-status');


(function (module) {
    /**
     * Delete public message reply API
    **/
    function DeleteAPI(parentRouter) {

        BaseAPI.call(this, parentRouter, '/delete', UserAuthorizationType.AuthorizationUser);

    };
    Util.inherits(DeleteAPI, BaseAPI);
    
    /**
     * Get required user status to run this service api
    */
    DeleteAPI.prototype.getRequiredStatus = function () {
        return UserStatus.ActiveUser;
    };

    /**
     * Delete public message reply
    **/
    DeleteAPI.prototype.run = function (request, response, _self) {
        var PublicMessageDTC = Rfr('data-access/dtc/public-message/public-message-dtc.js');
        var publicMessageId = request.body.publicMessageId;
        
        // Validate parameter first
        if (Util.isNullOrUndefined(request.body.publicMessageId)) {
            _self.sendErrorResponse(response, 'publicMessageDeletePublicMessageIdIsRequired');
            return;
        }
        
        Async.waterfall([
            // Validate this message is belong to current user or not
            function (innerCallback) {
                PublicMessageDTC.getInstance().getById(publicMessageId, function (error, publicMessageDTO) {
                    innerCallback(error, publicMessageDTO);
                });
            },
            function (publicMessageDTO, innerCallback) {
                if (Util.isNullOrUndefined(publicMessageDTO)) {
                    innerCallback('publicMessageDeletePublicMessageNotExisted');
                    return;
                };
                if (publicMessageDTO.createdWho !== request.user.mobile) {
                    innerCallback('publicMessageDeletePublicMessageWrongMobileNumber');
                    return;
                };
                innerCallback(null);
            },
            
            // Peform delete
            function (innerCallback) {
              PublicMessageDTC.getInstance().delete(publicMessageId, innerCallback);
            }
        ],
        
        function (error) {
            if (Util.isNullOrUndefined(error)) {
                _self.sendSimpleSuccessReponse(response);
            } else {
                _self.sendErrorResponse(response, error);
            }
        });
    };

    module.exports = DeleteAPI;
})(module);
