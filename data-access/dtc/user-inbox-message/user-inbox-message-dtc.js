//
// Load required modules
//
// External modules
var Rfr = require('rfr');
var Util = require('util');
var Async = require('async');
var _ = require('lodash');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();
var ResponseCode = Rfr('data-access/response-code.js');
var BaseDTC = Rfr('data-access/dtc/base-dtc.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var Validation = Rfr('data-access/validation');
var UserInboxDTO = Rfr('data-access/dtc/user-inbox/user-inbox-dto.js');
var UserInboxDTC = Rfr('data-access/dtc/user-inbox/user-inbox-dtc.js');
var UserInboxMessageDTO = Rfr('data-access/dtc/user-inbox-message/user-inbox-message-dto.js');
var UserInboxMessageMO = DatabaseContext.UserInboxMessage;


(function (module) {
    function UserInboxMessageDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(UserInboxMessageDTC, BaseDTC);

    /**
     * Instance of UserInboxMessageDTC, follows singleton pattern
    **/
    var instance = null;

    /**
     * Get instance of UserInboxMessageDTC
     * @return Return instance of UserInboxMessageDTC
    **/
    UserInboxMessageDTC.getInstance = function () {

        if (instance == null) {
            instance = new UserInboxMessageDTC();
        }

        return instance;
    };

    /**
     * Validate userInboxMessageDTO
     * @return Errors messages
    **/
    UserInboxMessageDTC.prototype.validate = function (userInboxMessageDTO) {
        var errors = [];

        Validation.isRequired('PublicMessageId', userInboxMessageDTO.publicMessageId, errors);
        Validation.isRequired('CreatedWhen', userInboxMessageDTO.createdWhen, errors);

        return errors;
    };
    
    /**
     * Map from DTO to MongooseObject
     * @param userInboxMessageDTO
     * @return Mongoose object
    **/
    UserInboxMessageDTC.prototype.mapFromDTO = function (userInboxMessageDTO) {
        var userInboxMessageMO = new UserInboxMessageMO({
            publicMessageId: userInboxMessageDTO.publicMessageId,
            hasSeen: userInboxMessageDTO.hasSeen,
            createdWhen: userInboxMessageDTO.createdWhen
        });

        return userInboxMessageMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    UserInboxMessageDTC.prototype.mapFromMO = function (mongooseObject) {
        var userInboxMessageDTO = new UserInboxMessageDTO({
            id: mongooseObject._id,
            publicMessageId: mongooseObject.publicMessageId,
            hasSeen: mongooseObject.hasSeen,
            createdWhen: new Date(mongooseObject.createdWhen)
        });

        return userInboxMessageDTO;
    };
    
    /**
     * Create new user inbox message
     * @param userInboxId - id of user inbox
     * @param userInboxMessageDTO User inbox message dto
     * @param callback - function (error, newDTO)
     *
    **/
    UserInboxMessageDTC.prototype.createNew = function (userInboxId, userInboxMessageDTO, callback) {
        var _self = this;

        // Validate userInboxDTO first
        var errors = _self.validate(userInboxMessageDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: userInboxId }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxMessageDTCNotExistedUserInboxId');
                    return;
                }
                
                innerCallback(null, userInboxMO);
            },

            function (userInboxMO, innerCallback) {
                var userInboxMessageMO = _self.mapFromDTO(userInboxMessageDTO);
                userInboxMO.userInboxMessage.push(userInboxMessageMO);
                userInboxMO.save(function (error) {
                    if (Util.isNullOrUndefined(error)) {
                        userInboxMessageDTO = _self.mapFromMO(userInboxMessageMO);
                    }
                    
                    innerCallback(error);
                });
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create new user inbox message: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }

            callback(null, userInboxMessageDTO);
        });
    };
    
    /**
     * Create new user inbox message by userID
     * It will create user inbox if not existed
     * @param userId - user Id
     * @param userInboxMessageDTO - user inbox message dto
     * @param callback - function (error, newDTO)
     */
    UserInboxMessageDTC.prototype.createNewByUserId = function (userId, userInboxMessageDTO, callback) {
        var _self = this;

        // Validate userInboxMessageDTO first
        var errors = _self.validate(userInboxMessageDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            function (innerCallback) {
                var userInboxDTO = new UserInboxDTO({
                    userId: userId
                });
                UserInboxDTC.getInstance().createIfNotExisted(userInboxDTO, function (error, newUserInboxDTO) {
                    innerCallback(error, newUserInboxDTO);
                });
            },
            function (userInboxDTO, innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: userInboxDTO.id }, function (error, userInboxMO) {
                    innerCallback(error, userInboxMO);
                });
            },
            function (userInboxMO, innerCallback) {
                var userInboxMessageMO = _self.mapFromDTO(userInboxMessageDTO);
                userInboxMO.userInboxMessage.push(userInboxMessageMO);
                userInboxMO.save(function (error) {
                    if (!Util.isNullOrUndefined(error)) {
                        innerCallback(error);
                        return;
                    }
                    
                    userInboxMessageDTO = _self.mapFromMO(userInboxMessageMO);
                    innerCallback(null, userInboxMessageDTO);
                });
            }
        ],

        // Final callback
        function (error, userInboxMessageDTO) {
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create new user inbox message: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }

            callback(null, userInboxMessageDTO);
        });
    };
    
    /**
     * Get user inbox message by their id
     * @param userInboxId - id of user inbox
     * @param userInboxMessageId - id of user inbox message
     * @param callback - function (error, dto)
    **/
    UserInboxMessageDTC.prototype.getById = function (userInboxId, userInboxMessageId, callback) {
        var _self = this;
        
        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ userInboxId: userInboxId }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxMessageDTCNotExistedUserInboxId');
                    return;
                }
                
                innerCallback(null, userInboxMO);
            },
            
            function (userInboxMO, innerCallback) {
                var userInboxMessageMO = userInboxMO.userInboxMessage.id(userInboxMessageId);
                if (Util.isNullOrUndefined(userInboxMessageMO)) {
                    innerCallback('userInboxMessageDTCNotExistedUserInboxMessageId');
                    return;
                }
                
                var userInboxMessageDTO = _self.mapFromMO(userInboxMessageMO);
                innerCallback(null, userInboxMessageDTO);
            }
        ],

        // Final callback
        function (error, userInboxMessageDTO) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot get user inbox message: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }
            
            callback(null, userInboxMessageDTO);
        });
    };
    
    /**
     * Delete user inbox by their id
     * @param userInboxId - id of user inbox
     * @param userInboxMessageId - id of user inbox message
     * @param callback - function (error, dto)
    **/
    UserInboxMessageDTC.prototype.delete = function (userInboxId, userInboxMessageId, callback) {
        var _self = this;
        
        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ userInboxId: userInboxId }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxMessageDTCNotExistedUserInboxId');
                    return;
                }
                
                innerCallback(null, userInboxMO);
            },
            
            function (userInboxMO, innerCallback) {
                var userInboxMessageMO = userInboxMO.userInboxMessage.id(userInboxMessageId);
                if (Util.isNullOrUndefined(userInboxMessageMO)) {
                    innerCallback('userInboxMessageDTCNotExistedUserInboxMessageId');
                    return;
                }
                
                userInboxMessageMO.remove();
                userInboxMO.save(function (error) {
                    innerCallback(error);
                });
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot delete user inbox message: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }
            
            callback(null);
        });
    };

    module.exports = UserInboxMessageDTC;
})(module);