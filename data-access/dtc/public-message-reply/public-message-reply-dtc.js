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
var PublicMessageReplyDTO = Rfr('data-access/dtc/public-message-reply/public-message-reply-dto.js');
var ResponseCode = Rfr('data-access/response-code.js');
var PublicMessageReplyMO = DatabaseContext.PublicMessageReply;


(function (module) {
    function PublicMessageReplyDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(PublicMessageReplyDTC, BaseDTC);

    /**
     * Instance of PublicMessageReplyDTC, follows singleton pattern
    **/
    var instance = null;

    /**
     * Get instance of PublicMessageDTC
     * @return Return instance of PublicMessageDTC
    **/
    PublicMessageReplyDTC.getInstance = function () {

        if (instance == null) {
            instance = new PublicMessageReplyDTC();
        }

        return instance;
    };

    /**
     * Validate PublicMessageReplyDTO
     * @return Errors messages
    **/
    PublicMessageReplyDTC.prototype.validate = function (publicMessageReplyDTO) {
        var errors = [];

        Validation.isRequired('Message', publicMessageReplyDTO.message, errors);
        Validation.isRequired('Created When', publicMessageReplyDTO.createdWhen, errors);
        Validation.isRequired('Created Who', publicMessageReplyDTO.createdWho, errors);

        return errors;
    };

    /**
     * Map from DTO to MongooseObject
     * @param publicMessageReplyDTO
     * @return Mongoose object
    **/
    PublicMessageReplyDTC.prototype.mapFromDTO = function (publicMessageReplyDTO) {
        var publicMessageReplyMO = new PublicMessageReplyMO({
            message: publicMessageReplyDTO.message,
            longitude: publicMessageReplyDTO.longitude,
            latitude: publicMessageReplyDTO.latitude,
            createdWhen: publicMessageReplyDTO.createdWhen,
            createdWho: publicMessageReplyDTO.createdWho
        });

        return publicMessageReplyMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    PublicMessageReplyDTC.prototype.mapFromMO = function (mongooseObject) {
        var publicMessageReplyDTO = new PublicMessageReplyDTO({
            id: mongooseObject._id,
            message: mongooseObject.message,
            longitude: mongooseObject.longitude,
            latitude: mongooseObject.latitude,
            createdWhen: new Date(mongooseObject.createdWhen),
            createdWho: mongooseObject.createdWho
        });

        return publicMessageReplyDTO;
    };

    /**
     * Create new public message reply
     * @param publicMessageId - public message id
     * @param publicMessageReplyDTO - public message reply dto
     * @param callback - function (error, results)
     *
    **/
    PublicMessageReplyDTC.prototype.createNew = function (publicMessageId, publicMessageReplyDTO, callback) {
        var _self = this;

        // Validate publicMessageReplyDTO first
        var errors = _self.validate(publicMessageReplyDTO);
        if (!_.isEmpty(errors)) {
            callback(errors);
            return;
        }

        Async.waterfall([
            // Find user by their mobile
            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: publicMessageReplyDTO.createdWho }, innerCallback);
            },
            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO)) {
                    innerCallback('publicMessageReplyDTCNotExistedUser');
                    return;
                }

                innerCallback(null);
            },


            // Find public message which this reply to
            function (innerCallback) {
                DatabaseContext.PublicMessage.findOne({ _id: publicMessageId }, function(error, publicMessageMO) {
                    innerCallback(error, publicMessageMO);
                });
            },
            function (publicMessageMO, innerCallback) {
                console.log('Test');
                if (Util.isNullOrUndefined(publicMessageMO)) {
                    innerCallback('publicMessageReplyDTCNotExistedUser');
                    return;
                }

                return innerCallback(null, publicMessageMO);
            },


            // Perform save
            function (publicMessageMO, innerCallback) {
                var publicReplyMessageMO = _self.mapFromDTO(publicMessageReplyDTO);
                publicMessageMO.publicMessageReply.push(publicReplyMessageMO);
                publicMessageMO.save(function (error) {
                    if(Util.isNullOrUndefined(error)){
                        publicMessageReplyDTO.id = publicReplyMessageMO._id.toString();
                    }

                    innerCallback(error);
                });
            }
        ],


        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot reply to public message. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            callback(null, publicMessageReplyDTO);
        });
    };

    PublicMessageReplyDTC.prototype.delete = function (publicMessageId, publicMessageReplyId, callback) {
        var _self = this;
        var _publicMessageMO = null;

        Async.waterfall([
            // Find user by their mobile
            function (innerCallback) {
                DatabaseContext.PublicMessage.findOne({ _id: publicMessageId }, innerCallback);
            },
            function (publicMessageMO, innerCallback) {
                if (Util.isNullOrUndefined(publicMessageMO)) {
                    innerCallback('publicMessageReplyDTCNotExistedPublicMessage');
                    return;
                }

                _publicMessageMO = publicMessageMO;
                innerCallback(null, _publicMessageMO.publicMessageReply.id(publicMessageReplyId));
            },


            // Find public message which this reply to
            function (publicMessageReplyMO, innerCallback) {
                publicMessageReplyMO.remove(function (error) {
                    innerCallback(error);
                });
            },
            function (innerCallback) {
                _publicMessageMO.save(function (error) {
                    innerCallback(error);
                });
            }
        ],


        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot delete public message reply. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            _publicMessageMO = null;
            callback(null);
        });
    };

    module.exports = PublicMessageReplyDTC;
})(module);
