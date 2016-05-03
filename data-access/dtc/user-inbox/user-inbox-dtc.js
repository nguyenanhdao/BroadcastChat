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
var BaseDTC = Rfr('data-access/dtc/base-dtc.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var Validation = Rfr('data-access/validation');
var UserInboxDTO = Rfr('data-access/dtc/user-inbox/user-inbox-dto.js');
var ResponseCode = Rfr('data-access/response-code.js');
var UserInboxMO = DatabaseContext.UserInbox;


(function (module) {
    function UserInboxDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(UserInboxDTC, BaseDTC);

    /**
     * Instance of UserInboxDTC, follows singleton pattern
    **/
    var instance = null;

    /**
     * Get instance of UserLocationDTC
     * @return Return instance of UserLocationDTC
    **/
    UserInboxDTC.getInstance = function () {

        if (instance == null) {
            instance = new UserInboxDTC();
        }

        return instance;
    };

    /**
     * Validate UserInboxDTO
     * @return Errors messages
    **/
    UserInboxDTC.prototype.validate = function (userInboxDTO) {
        var errors = [];

        Validation.isRequired('UserId', userInboxDTO.userId, errors);

        return errors;
    };
    
    /**
     * Map from DTO to MongooseObject
     * @param userInboxDTO
     * @return Mongoose object
    **/
    UserInboxDTC.prototype.mapFromDTO = function (userInboxDTO) {
        var userInboxMO = new UserInboxMO({
            userId: userInboxDTO.userId
        });

        return userInboxMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    UserInboxDTC.prototype.mapFromMO = function (mongooseObject) {
        var userInboxDTO = new UserInboxDTO({
            id: mongooseObject._id,
            userId: mongooseObject.userId
        });

        return userInboxDTO;
    };
    
    /**
     * Create new user inbox
     * @param userInboxDTO
     * @param callback (error, results)
     *
    **/
    UserInboxDTC.prototype.createNew = function (userInboxDTO, callback) {
        var _self = this;

        // Validate userInboxDTO first
        var errors = _self.validate(userInboxDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            // Find user by their id
            function (innerCallback) {
                DatabaseContext.User.findOne({ _id: userInboxDTO.userId}, innerCallback);
            },
            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO)) {
                    innerCallback('userInboxDTCNotExistedUser');
                    return;
                }
                
                innerCallback(null);
            },

            // Create new
            function (innerCallback) {
                var userInboxMO = _self.mapFromDTO(userInboxDTO);
                userInboxMO.save(function (error) {
                    if (Util.isNullOrUndefined(error)) {
                        userInboxDTO = _self.mapFromMO(userInboxMO);
                    }
                    innerCallback(error);
                });
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create new user inbox: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }

            callback(null, userInboxDTO);
        });
    };
    
    /**
     * Create user inbox dto if not existed (check existed by finding userId)
     * @param userInboxDTO - user inbox dto
     * @param callback - function(error, results)
     */
    UserInboxDTC.prototype.createIfNotExisted = function (userInboxDTO, callback) {
        var _self = this;

        // Validate userInboxDTO first
        var errors = _self.validate(userInboxDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            // Find UserInboxMO by their userId
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ userId: userInboxDTO.userId }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (!Util.isNullOrUndefined(userInboxMO)) {
                    userInboxDTO = _self.mapFromMO(userInboxMO);
                    innerCallback(null, userInboxDTO);
                    return;
                }
                
                // Create new if not existed
                _self.createNew(userInboxDTO, function (error, newDTO) {
                    innerCallback(error, newDTO);
                });
            }
        ],

        // Final callback
        function (error, newDTO) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create new user inbox: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }

            userInboxDTO = newDTO;
            callback(null, userInboxDTO);
        });
    };
    
    /**
     * Delete userInboxDTO
     * @param userInboxDTO - user inbox dto
     * @param callback - function(error, results) return error when cannot find this element
     */
    UserInboxDTC.prototype.delete = function (userInboxDTO, callback) {
        Async.waterfall([
            // Find UserInboxMO by their userId
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: userInboxDTO.id }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxDTCNotExistedInboxId');
                    return;
                }
                
                userInboxMO.remove(function (error) {
                    innerCallback(error);
                });
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot delete user inbox: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }
            
            callback(null);
        });
    };
    
    /**
     * Get user inbox by id
     * @param id - user inbox id
     * @callback - function (error, userInboxDTO)
     */
    UserInboxDTC.prototype.getById = function (id, callback) {
        var _self = this;
        
        Async.waterfall([
            // Find UserInboxMO by their userId
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: id }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxDTCNotExistedInboxId');
                    return;
                }
                
                var userInboxDTO = _self.mapFromMO(userInboxMO);
                innerCallback(null, userInboxDTO);
            }
        ],

        // Final callback
        function (error, userInboxDTO) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot get user inbox: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }
            
            callback(null, userInboxDTO);
        });
    };
    
    /**
     * Get user inbox by id
     * @param id - user inbox id
     * @callback - function (error, userInboxDTO)
     */
    UserInboxDTC.prototype.getByUserId = function (userId, callback) {
        var _self = this;
        
        Async.waterfall([
            // Find UserInboxMO by their userId
            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ userId: userId }, innerCallback);
            },
            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    innerCallback('userInboxDTCNotExistedInboxId');
                    return;
                }
                
                var userInboxDTO = _self.mapFromMO(userInboxMO);
                innerCallback(null, userInboxDTO);
            }
        ],

        // Final callback
        function (error, userInboxDTO) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot get user inbox: ', ResponseCode.getMessage(error));
                callback(error, null);
                return;
            }
            
            callback(null, userInboxDTO);
        });
    };


    module.exports = UserInboxDTC;
})(module);