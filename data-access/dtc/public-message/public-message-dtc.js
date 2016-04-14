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
var PublicMessageDTO = Rfr('data-access/dtc/public-message/public-message-dto.js');
var ResponseCode = Rfr('data-access/response-code.js');
var PublicMessageMO = DatabaseContext.PublicMessage;


(function (module) {
    function PublicMessageDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(PublicMessageDTC, BaseDTC);

    /**
     * Instance of PublicMessageDTC, follows singleton pattern
    **/
    var instance = null;

    /**
     * Get instance of PublicMessageDTC
     * @return Return instance of PublicMessageDTC
    **/
    PublicMessageDTC.getInstance = function () {

        if (instance == null) {
            instance = new PublicMessageDTC();
        }

        return instance;
    };

    /**
     * Validate PublicMessageDTO
     * @return Errors messages
    **/
    PublicMessageDTC.prototype.validate = function (publicMessageDTO) {
        var errors = [];

        Validation.isRequired('Message', publicMessageDTO.message, errors);
        Validation.isRequired('Longitude', publicMessageDTO.longitude, errors);
        Validation.isRequired('Latitude', publicMessageDTO.latitude, errors);
        Validation.isRequired('Created When', publicMessageDTO.createdWhen, errors);
        Validation.isRequired('Created Who', publicMessageDTO.createdWho, errors);

        return errors;
    };

    /**
     * Map from DTO to MongooseObject
     * @param publicMessageDTO
     * @return Mongoose object
    **/
    PublicMessageDTC.prototype.mapFromDTO = function (publicMessageDTO) {
        var publicMessageMO = new PublicMessageMO({
            message: publicMessageDTO.message,
            longitude: publicMessageDTO.longitude,
            latitude: publicMessageDTO.latitude,
            createdWhen: publicMessageDTO.createdWhen,
            createdWho: publicMessageDTO.createdWho
        });

        return publicMessageMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    PublicMessageDTC.prototype.mapFromMO = function (mongooseObject) {
        var publicMessageDTO = new PublicMessageDTO({
            id: mongooseObject._id,
            message: mongooseObject.message,
            longitude: mongooseObject.longitude,
            latitude: mongooseObject.latitude,
            createdWhen: new Date(mongooseObject.createdWhen),
            createdWho: mongooseObject.createdWho
        });

        return publicMessageDTO;
    };

    /**
     * Create new public message
     * @param public message dto
     * @param callback (error, results)
     *
    **/
    PublicMessageDTC.prototype.createNew = function (publicMessageDTO, callback) {
        var _self = this;

        // Validate publicMessageDTO first
        var errors = _self.validate(publicMessageDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            // Find user by their mobile
            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: publicMessageDTO.createdWho }, innerCallback);
            },

            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO)) {
                    return innerCallback('publicMessageDTCNotExistedUser');
                }

                return innerCallback(null, userMO);
            },

            function (userMO, innerCallback) {
                var publicMessageMO = _self.mapFromDTO(publicMessageDTO);
                publicMessageMO.save(function (error) {
                    if(Util.isNullOrUndefined(error)){
                        publicMessageDTO.id = publicMessageMO._id.toString();
                    }

                    innerCallback(error);
                });
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create public message. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            callback(null, publicMessageDTO);
        });
    };

    module.exports = PublicMessageDTC;
})(module);
