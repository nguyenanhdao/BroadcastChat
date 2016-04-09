﻿//
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
var UserMO = DatabaseContext.User;


(function (module) {
    function UserDTC() {
        BaseDTC.call(this);
    };
    Util.inherits(UserDTC, BaseDTC);
    
    /**
     * Instance of UserDTC, follows singleton pattern
    **/
    var instance = null;
    
    /**
     * Get instance of UserDTC
     * @return Return instance of UserDTC
    **/
    UserDTC.getInstance = function () {

        if (instance == null) {
            instance = new UserDTC();
        }

        return instance;
    };
    
    /**
     * Validate UserDTO
     * @return Promise
    **/
    UserDTC.prototype.validate = function (userDTO) {
        var errors = [];

        Validation.isRequired('Mobile', userDTO.mobile, errors);
        Validation.isNumberOnly('Mobile', userDTO.mobile, errors);

        Validation.isRequired('Password', userDTO.password, errors);
        Validation.isRequired('Full Name', userDTO.fullName, errors);

        return errors;
    };
    
    /**
     * Map from DTO to MongooseObject
     * @param userDTO
     * @return Mongoose object
    **/
    UserDTC.prototype.mapFromDTO = function (userDTO) {
        var userMO = new UserMO({
            mobile: userDTO.mobile,
            password: userDTO.password,
            fullName: userDTO.fullName
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
            fullName: mongooseObject.fullName
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
                    return innerCallback('Existed mobile number.');
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
                SystemLog.error('Cannot create new user. Error: ', error);
                return callback('Cannot create new user.', null);
            }
            
            return callback(null, userDTO);
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
                SystemLog.error('Cannot delete user. Error: ', error);
                return callback('Cannot delete user.', null);
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
                return callback('Cannot find user by user\'s mobile.', null);
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

    module.exports = UserDTC;
})(module);