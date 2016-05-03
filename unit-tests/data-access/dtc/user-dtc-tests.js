//
// Load required modules
//
// External modules
var Assert = require('assert');
var Rfr = require('rfr');
var Util = require('util');
var Async = require('async');
var _ = require('lodash');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();
var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
var BaseTest = Rfr('unit-tests/base-test.js');
var UnitTestUtils = Rfr('unit-tests/unit-test-utils.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var UserLocationDTO = Rfr('data-access/dtc/user-location/user-location-dto.js');
var UserLocationDTC = Rfr('data-access/dtc/user-location/user-location-dtc.js');
var UserDTO = Rfr('data-access/dtc/user/user-dto.js');
var UserMO = DatabaseContext.User;
var AuthorizationType = Rfr('api-v1/user-authorization-type.js');
var UserStatus = Rfr('data-access/dtc/user/user-status.js');

(function (module) {

    /**
     * Create new unit test object for UserDTC
    **/
    function UserDTCTests() {
        BaseTest.call(this, 'UserDTC');
    };
    Util.inherits(UserDTCTests, BaseTest);

    /**
     * Setup unit test enviroment
    **/
    UserDTCTests.prototype.setup = function (callback) {
        var _self = this;

        Async.waterfall([
            _self.clean.bind(_self),
            function (innerCallback) {
                UnitTestUtils.createNewUser(function (error, newUser) {
                    _self._unitTestUser = newUser;
                    innerCallback(error);
                });
            }
        ],

        function (error) {
            callback(error);
        });
    };

    /**
     * Clean up unittest resouces
    **/
    UserDTCTests.prototype.clean = function (callback) {
        this._unitTestUser = null;

        // Remove all users have name start with unittest
        DatabaseContext.User.remove({ fullName: new RegExp('unittest', 'i') }, function (error) {
            callback(error);
        });
    };

    /**
     * Test for getByMobile function
    **/
    UserDTCTests.prototype.getByMobile = function (callback) {
        var _self = this;

        UserDTC.getInstance().getByMobile(_self._unitTestUser.mobile, function (error, userDTO) {
            Assert.ifError(error);
            Assert.equal(userDTO.mobile, _self._unitTestUser.mobile);
            Assert.equal(userDTO.password, _self._unitTestUser.password);
            Assert.equal(userDTO.fullName, _self._unitTestUser.fullName);

            SystemLog.info(_self._name + ' - test case - getByMobile passed the test.');
            callback(null);
        });
    };

    /**
     * Test for createnew function
    **/
    UserDTCTests.prototype.createNew = function (callback) {
        var _self = this;
        var newUser = new UserDTO({
            mobile: '01294419331',
            fullName: 'UnitTest createnew user',
            password: 'UnitTest createnew password',
            createdWhen: new Date(),
            authorizationType: AuthorizationType.AuthorizationUser,
            status: UserStatus.ActiveUser
        });

        Async.waterfall([
            function (innerCallback) {
                DatabaseContext.User.remove({ mobile: newUser.mobile }, function (error) {
                    innerCallback(error);
                });
            },

            function (innerCallback) {
                UserDTC.getInstance().createNew(newUser, function (error, userDTO) {
                    innerCallback(error);
                });
            },

            function (innerCallback) {
                DatabaseContext.User.findOne({ mobile: newUser.mobile }, function (error, userMO) {
                    innerCallback(error, userMO);
                });
            },

            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO)) {
                    Assert.fail();
                }

                Assert.equal(userMO.mobile, newUser.mobile);
                Assert.equal(userMO.fullName, newUser.fullName);
                Assert.equal(userMO.password, newUser.password);
                Assert.equal((new Date(userMO.createdWhen)).getTime(), newUser.createdWhen.getTime());
                innerCallback(null);
            }
        ],

        function (error) {
            Assert.ifError(error);

            SystemLog.info(_self._name + ' - test case - createNew passed the test.');
            callback(null);
        });
    };
    
    /**
     * Test for get list user nearby
    **/
    UserDTCTests.prototype.getUserNearby = function (callback) {
        var _self = this;
        
        Async.waterfall([
            function (innerCallback) {
                var newUserLocation = new UserLocationDTO({
                    longitude: 11.23,
                    latitude: 12.13,
                    createdWhen: new Date()
                });
                UserLocationDTC.getInstance().createNew(_self._unitTestUser.id, newUserLocation, function (error) {
                    innerCallback(error);
                });
            },
            function (innerCallback) {
                var newUserLocation = new UserLocationDTO({
                    longitude: 106.636383,
                    latitude: 10.784734,
                    createdWhen: new Date()
                });
                UserLocationDTC.getInstance().createNew(_self._unitTestUser.id, newUserLocation, function (error) {
                    innerCallback(error);
                });
            },
            function (innerCallback) {
                var maxDistance = 0.5;
                var centerLocation = {
                    longitude: 106.636522,
                    latitude: 10.785751
                };

                UserDTC.getInstance().getUserNearby(centerLocation, maxDistance, function (error, listUser) {
                    innerCallback(error, listUser);
                });
            },
            function (listUser, innerCallback) {
                if (Util.isNullOrUndefined(listUser)) {
                    Assert.fail();
                }
                
                Assert.equal(listUser[0].id.toString(), _self._unitTestUser.id);
                innerCallback(null);
            }
        ],
        
        function (error) {
            Assert.ifError(error);

            SystemLog.info(_self._name + ' - test case - getUserNearby passed the test.');
            callback(null);
        });
    };

    /**
     * Test for validation function of UserDTC
    **/
    UserDTCTests.prototype.validate = function (callback) {
        var _self = this;

        // Validate required field
        var newUser = new UserDTO({
            mobile: '',
            fullName: '',
            password: '',
            createdWhen: null
        });
        var validationErrors = UserDTC.getInstance().validate(newUser);
        Assert.notEqual(_.indexOf(validationErrors, 'Mobile is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Mobile must has at least 8 characters.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Password is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Full Name is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Created When is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Status is required.'), -1);
        
        // Validate custom validation
        newUser = new UserDTO({
            mobile: 'abcd'
        });
        validationErrors = UserDTC.getInstance().validate(newUser);
        Assert.notEqual(_.indexOf(validationErrors, 'Mobile must contains only numbers.'), -1);
        
        newUser = new UserDTO({
            mobile: '0123456789123456'
        });
        validationErrors = UserDTC.getInstance().validate(newUser);
        Assert.notEqual(_.indexOf(validationErrors, 'Mobile must has maximum 15 characters.'), -1);

        SystemLog.info(_self._name + ' - test case - validate passed the test.');
        callback(null);
    },

    /**
     * Override doTest function of base-test to run test case
    **/
    UserDTCTests.prototype.doTest = function (callback) {
        Async.waterfall([
            this.validate.bind(this),
            this.getByMobile.bind(this),
            this.createNew.bind(this),
            this.getUserNearby.bind(this)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = UserDTCTests;
})(module);
