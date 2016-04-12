//
// Load required modules
//
// External modules
var Rfr = require('rfr');
var Promise = require('promise');
var Util = require('util');
var _ = require('lodash');
var Async = require('async');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();
var BaseDTC = Rfr('data-access/dtc/base-dtc.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var Validation = Rfr('data-access/validation');
var UserDTO = Rfr('data-access/dtc/user/user-dto.js');
var ResponseCode = Rfr('data-access/response-code.js');
var UserMO = DatabaseContext.User;


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
    UserDTC.prototype.mapFromDTO = function (userDTO) {
        var userMO = new UserMO({
            mobile: userDTO.mobile,
            password: userDTO.password,
            fullName: userDTO.fullName,
            createdWhen: userDTO.createdWhen
        });

        return userMO;
    };

    /**
     * Map from Mongoose object to DTO
     * @return DTO
    **/
    UserDTC.prototype.mapFromMO = function (mongooseObject) {
        var userDTO = new UserDTO({
            mobile: mongooseObject.mobile,
            password: mongooseObject.password,
            fullName: mongooseObject.fullName,
            createdWhen: mongooseObject.createdWhen
        });

        return userDTO;
    };

    /**
     * Create new user
     * @param userDTO user DTO
     * @param callback (error, results)
     *
    **/
    UserDTC.prototype.createNew = function (userDTO, callback) {
        var _self = this;

        // Validate userDTO first
        var errors = _self.validate(userDTO);
        if (!_.isEmpty(errors)) {
            return callback(errors);
        }

        Async.waterfall([
            // Try to find duplicated mobile number
            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: userDTO.mobile }, innerCallback);
            },

            // Check duplicated
            function (userMO, innerCallback) {
                if (!Util.isNullOrUndefined(userMO)) {
                    return innerCallback('userDTCDuplicatedMobileNumber');
                }

                return innerCallback(null);
            },

            // Add new user if mobile number is not registered yet
            function (innerCallback) {
                var userMO = _self.mapFromDTO(userDTO);
                userMO.save(innerCallback);
            }
        ],

        // Final callback
        function (error) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot create new user. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            callback(null, userDTO);
        });
    };

    /**
     * Delete user
     * @param userDTO user DTO
     * @callback (error, results)
     *
    **/
    UserDTC.prototype.delete = function (userDTO, callback) {
        var _self = this;

        Async.waterfall([
            // Get user MongooseObject from database
            function (innerCallback) {
                Database.User.findOne({ mobile: userDTO.mobile }, innerCallback);
            },

            // Peform delete
            function (userMO, innerCallback) {
                if (!Util.isNullOrUndefined(userMO)) {
                    userMO.remove(innerCallback);
                } else {
                    innerCallback(null);
                }
            }
        ],

        // Final callback
        function (error) {
            // Handle database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot delete user. Error: ', ResponseCode.getMessage(error));
                return callback(ResponseCode.getMessage(error), null);
            }

            return callback(null);
        });
    };

    /**
     * Get user dto by mobile
     * @param mobile - user mobile number
     * @param callback (error, results) - results contains UserDTO which has the same mobile number
     *
    **/
    UserDTC.prototype.getByMobile = function (mobile, callback) {
        var _self = this;

        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: mobile }, innerCallback);
            },

            function (userMO, innerCallback) {
                if (!Util.isNullOrUndefined(userMO)) {
                    return innerCallback(null, _self.mapFromMO(userMO));
                }

                return innerCallback(null, null);
            }
        ],

        function (error, result) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot find user by user\'s mobile: ' + mobile, error);
                return callback(ResponseCode.getMessage('databaseError'), null);
            }

            return callback(null, result);
        });
    };

    /**
     * Get all registered user
     * @param callback (error, results) results contains list UserDTO
     *
    **/
    UserDTC.prototype.getAll = function (callback) {
        var _self = this;


        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.User.find({}, innerCallback);
            },

            function (listUserMO, innerCallback) {
                // Map from list Mongoose Object to UserDTO
                var results = [];
                listUserMO = listUserMO || [];
                listUserMO.forEach(function (userMO) {
                    results.push(_self.mapFromMO(userMO));
                });
                innerCallback(null, results);
            }
        ],

        function (error, results) {
            // Log database error
            if (!Util.isNullOrUndefined(error)) {
                SystemLog.error('Cannot get all user in database. Error: ', error);
                return callback('Cannot get all user in database.', null);
            }

            return callback(null, result);
        });
    };

    module.exports = UserLocationDTO;
})(module);
