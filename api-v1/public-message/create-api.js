//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Async = require('async');
var _ = require('lodash');

// Internal library
var BaseAPI = Rfr('api-v1/base-api.js');
var Configuration = Rfr('configuration.js');
var UserStatus = Rfr('data-access/dtc/user/user-status');
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var SystemLog = Rfr('system-log.js').getInstance();

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
        
        Async.waterfall([
            function (innerCallback) {
                // TO-DO count maximum public message per day user can send here
                innerCallback(null);
            },
            function (innerCallback) {
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
                        innerCallback(errorCode);
                    } else {
                        _self.sendSuccessResponse(response, 'ok', data);
                        innerCallback(null, data);
                    }
                });
            },
            function (publicMessageDTO, innerCallback) {
                // After sending response to user
                // Run this background job to send message to all user
                _self.sendPublicMessage(publicMessageDTO, function (error) {
                    innerCallback(error);
                });
            }
        ],
        
        function (error) {
            if(!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot send public message to nearby user.', error);
            }
        });
    };
    
    /**
     * Send public message to nearby user (background job, just run)
     */
    CreateAPI.prototype.sendPublicMessage = function (publicMessageDTO, callback) {
        
        Async.waterfall([
            function (innerCallback) {
                var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
                var messageLocation = {
                    longitude: publicMessageDTO.longitude,
                    latitude: publicMessageDTO.latitude
                };
                UserDTC.getInstance().getUserNearby(messageLocation, Configuration.MAX_DISTANCE, function (error, listUserNearby) {
                    innerCallback(error, listUserNearby);
                });
            },
            function (listUserNearby, innerCallback) {
                if (Util.isNullOrUndefined(listUserNearby) || _.isEmpty(listUserNearby)) {
                    innerCallback(null);
                    return;
                }
                
                var UserInboxMessageDTC = Rfr('data-access/dtc/user-inbox-message/user-inbox-message-dtc.js');
                var UserInboxMessageDTO = Rfr('data-access/dtc/user-inbox-message/user-inbox-message-dto.js');
                var userInboxMessageDTO = new UserInboxMessageDTO({
                    publicMessageId: publicMessageDTO.id,
                    hasSeen: false,
                    createdWhen: new Date()
                });
                
                var index = 0;
                var totalUser = listUserNearby.length;
                listUserNearby.forEach(function (user) {
                    UserInboxMessageDTC.getInstance().createNewByUserId(user.id, userInboxMessageDTO, function (error, newDTO) {
                        index = index + 1;
                        
                        if (!Util.isNullOrUndefined(error)) {
                            SystemLog.error('Cannot send public message to user, userId: ' + user.id, error);
                        }
                        
                        if (index == totalUser - 1) {
                            innerCallback(null);
                        }
                    });
                });
            }
        ],
        
        function (error) {
            callback(error);
        });
    };
    
    module.exports = CreateAPI;
})(module);
