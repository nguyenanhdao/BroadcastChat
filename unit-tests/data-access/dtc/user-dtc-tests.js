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
var DatabaseContext = Rfr('data-access/database-context.js');
var UserDTO = Rfr('data-access/dtc/user/user-dto.js');
var UserMO = DatabaseContext.User;


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
        this._unitTestUser = new UserMO({
            mobile: '0914090540',
            fullName: 'UnitTest fullname',
            password: 'UnitTest password',
            createdWhen: Date.now()
        });

        this._unitTestUser.save(function (error) {
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
            createdWhen: Date.now()
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
        Assert.notEqual(_.indexOf(validationErrors, 'Password is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Full Name is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Created When is required.'), -1);

        // Validate custom validation
        newUser = new UserDTO({
            mobile: 'abcd'
        });
        Assert.notEqual(_.indexOf(validationErrors, 'Mobile must contains only numbers.'), -1);

        SystemLog.info(_self._name + ' - test case - validate passed the test.');
        callback(null);
    },

    /**
     * Override doTest function of base-test to run test case
    **/
    UserDTCTests.prototype.doTest = function (callback) {
        var _self = this;

        Async.waterfall([
            _self.validate.bind(_self),
            _self.getByMobile.bind(_self),
            _self.createNew.bind(_self)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = UserDTCTests;
})(module);
