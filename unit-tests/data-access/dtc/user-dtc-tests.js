//
// Load required modules
//
// External modules
var Assert = require('assert');
var Rfr = require('rfr');
var Util = require('util');
var Async = require('async');

// Internal modules
var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
var BaseTest = Rfr('unit-tests/base-test.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var UserMO = DatabaseContext.User;

(function(module){

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
            mobile: 0914090540,
            fullName: 'UnitTest fullname',
            password: 'UnitTest password'
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
        DatabaseContext.User.remove({ fullName: new RegExp('unittest', 'i') }, function (error){
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
            callback(null);
        });
    };

    /**
     * Override doTest function of base-test to run test case
    **/
    UserDTCTests.prototype.doTest = function (callback) {
        this.getByMobile(callback);
    };

    module.exports= UserDTCTests;
})(module);
