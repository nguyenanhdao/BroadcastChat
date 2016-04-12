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
var UserLocationDTO = Rfr('data-access/dtc/user-location/user-location-dto.js');
var ResponseCode = Rfr('data-access/response-code.js');
var UserLocationMO = DatabaseContext.UserLocation;


(function (module) {
    function UserLocationDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(UserLocationDTC, BaseDTC);

    /**
     * Instance of UserLocationDTC, follows singleton pattern
    **/
    var instance = null;

    /**
     * Get instance of UserLocationDTC
     * @return Return instance of UserLocationDTC
    **/
    UserLocationDTC.getInstance = function () {

        if (instance == null) {
            instance = new UserLocationDTC();
        }

        return instance;
    };

    /**
     * Validate UserLocationDTO
     * @return Errors messages
    **/
    UserLocationDTC.prototype.validate = function (userLocationDTO) {
        var errors = [];

        Validation.isRequired('Longitude', userLocationDTO.longitude, errors);
        Validation.isRequired('Latitude', userLocationDTO.latitude, errors);
        Validation.isRequired('Created When', userLocationDTO.createdWhen, errors);

        return errors;
    };

    /**
     * Map from DTO to MongooseObject
     * @param userLocationDTO
     * @return Mongoose object
    **/
    UserLocationDTC.prototype.mapFromDTO = function (userLocationDTO) {
        var userLocationMO = new UserLocationMO({
            longitude: userLocationDTO.longitude,
            latitude: userLocationDTO.latitude,
            createdWhen: userLocationDTO.createdWhen
        });

        return userLocationMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    UserLocationDTC.prototype.mapFromMO = function (mongooseObject) {
        var userLocationDTO = new UserLocationDTO({
            longitude: mongooseObject.longitude,
            latitude: mongooseObject.latitude,
            createdWhen: mongooseObject.createdWhen
        });

        return userLocationDTO;
    };

    /**
     * Create new user location log
     * @param mobile user's mobile
     * @param userLocationDTO user location dto
     * @param callback (error, results)
     *
    **/
    UserLocationDTC.prototype.createNew = function (mobile, userLocationDTO, callback) {
        var _self = this;

        // Validate userLocationDTO first
        var errors = _self.validate(userLocationDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            // Find user by their mobile
            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: mobile }, innerCallback);
            },

            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO)) {
                    return innerCallback('userLocationDTCNotExistedUser');
                }

                return innerCallback(null, userMO);
            },

            // Add new user if mobile number is not registered yet
            function (userMO, innerCallback) {
                var userLocationMO = _self.mapFromDTO(userLocationDTO);
                userMO.userLocation.push(userLocationMO);
                userMO.save(innerCallback);
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create user location log. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            callback(null, userLocationDTO);
        });
    };

    module.exports = UserLocationDTC;
})(module);
