//
// Load required modules
//
// External modules
var Rfr = require('rfr');
var Promise = require('promise');
var Util = require('util');
var _ = require('lodash');

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
     * @return promise contains new user
     * 
    **/
    UserDTC.prototype.createNew = function (userDTO) {
        var _self = this;

        // Validate userDTO first
        var errors = _self.validate(userDTO);
        if (!_.isEmpty(errors)) {
            return Promise.reject(errors);
        }


        return new Promise(function (resolve, reject) {
            var userMO = _self.mapFromDTO(userDTO);
            userMO.save(function (error) {
                // Error
                if (!Util.isNullOrUndefined(error)) {
                    SystemLog.error('Cannot find create new user.', error);
                    return reject(error);
                };
                
                // Return new object
                userDTO.password = null;
                resolve(userDTO);
            });
        });
    };
    
    
    /**
     * Delete user
     * @param userDTO user DTO
     * @return promise
    **/
    UserDTC.prototype.delete = function (userDTO) {
        return new Promise(function (resolve, reject) {
            Database.User.find({ mobile: userDTO.mobile }, function (error, userMO) {
                // Check that we can find that user
                if (!Util.isNullOrUndefined(error)) {
                    SystemLog.error('Cannot find user by user\'mobile: ' + userDTO.mobile, error);
                    return reject(error);
                }
                
                // User is found
                // Invoke remove function
                userMO.remove(function (error) {
                    if (!Util.isNullOrUndefined(error)) {
                        SystemLog.error('Cannot delete user', error);
                        return reject(error);
                    }

                    resolve();
                });
            });
        });
    };
    
    /**
     * Get user dto by mobile
     * @param mobile - user mobile number
     * @return promise contains user
     * 
    **/
    UserDTC.prototype.getByMobile = function (mobile) {
        var _self = this;

        return new Promise(function (resolve, reject) {
            DatabaseContext.User.find({ mobile: mobile }, function (error, userMO) {
                if (!Util.isNullOrUndefined(error)) {
                    SystemLog.error('Cannot find user by user\'s mobile: ' + mobile, error);
                    return reject(error);
                }

                resolve(_self.mapFromMO(userMO));
            });
        });
    };
    
    /**
     * Get all registered user
     * @return Promise contains all users
     * 
    **/
    UserDTC.prototype.getAll = function () {
        var _self = this;

        return new Promise(function (resolve, reject) {
            DatabaseContext.User.find({}, function (error, listUserMO) {
                var results = [];
                
                // Send promise reject if error
                if (!Util.isNullOrUndefined(error)) {
                    SystemLog.error('Cannot get list users.', error);
                    return reject(error);
                }
                
                // Map from list Mongoose Object to UserDTO
                listUserMO = listUserMO || [];
                listUserMO.forEach(function (userMO) {
                    results.push(_self.mapFromMO(userMO));
                });

                resolve(results);
            });
        });
    };

    module.exports = UserDTC;
})(module);