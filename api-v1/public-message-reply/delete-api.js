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
        var PublicMessageReplyDTC = Rfr('data-access/dtc/public-message-reply/public-message-reply-dtc.js');
        var PublicMessageReplyDTO = Rfr('data-access/dtc/public-message-reply/public-message-reply-dto.js');
        var publicMessageId = request.body.publicMessageId;
        var publicMessageReplyId = request.body.publicMessageReplyId;
        
        // Validate parameter first
        if (Util.isNullOrUndefined(request.body.publicMessageId)) {
            _self.sendErrorResponse(response, 'publicMessageReplyDeletePublicMessageReplyPublicMessageIdIsRequired');
            return;
        }
        if (Util.isNullOrUndefined(request.body.publicMessageReplyId)) {
            _self.sendErrorResponse(response, 'publicMessageReplyDeletePublicMessageReplyPublicMessageReplyIdIsRequired');
            return;
        }
        
        Async.waterfall([
            // Validate this message is belong to current user or not
            function (innerCallback) {
                PublicMessageReplyDTC.getInstance().getById(publicMessageId, publicMessageReplyId, function (error, publicMessageReplyDTO) {
                    innerCallback(error, publicMessageReplyDTO);
                });
            },
            function (publicMessageReplyDTO, innerCallback) {
                if (Util.isNullOrUndefined(publicMessageReplyDTO)) {
                    innerCallback('publicMessageReplyDeletePublicMessageReplyNotExisted');
                    return;
                };
                if (publicMessageReplyDTO.createdWho !== request.user.id) {
                    innerCallback('publicMessageReplyDeletePublicMessageReplyWrongMobileNumber');
                    return;
                };
                innerCallback(null);
            },
            
            // Peform delete
            function (innerCallback) {
              PublicMessageReplyDTC.getInstance().delete(publicMessageId, publicMessageReplyId, innerCallback);
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
