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
var BaseTest = Rfr('unit-tests/base-test.js');
var UnitTestUtils = Rfr('unit-tests/unit-test-utils.js');
var DatabaseContext = Rfr('data-access/database-context.js');
var UserLocationDTC = Rfr('data-access/dtc/user-location/user-location-dtc.js');
var UserLocationDTO = Rfr('data-access/dtc/user-location/user-location-dto.js');
var UserLocationMO = DatabaseContext.UserLocation;
var UserMO = DatabaseContext.User;


(function (module) {

    /**
     * Create new unit test object for UserLocationDTC
    **/
    function UserLocationDTCTests() {
        BaseTest.call(this, 'UserLocationDTC');
    };
    Util.inherits(UserLocationDTCTests, BaseTest);

    /**
     * Setup unit test enviroment
    **/
    UserLocationDTCTests.prototype.setup = function (callback) {
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
    UserLocationDTCTests.prototype.clean = function (callback) {
        this._unitTestUser = null;

        // Remove all users have name start with unittest
        DatabaseContext.User.remove({ fullName: new RegExp('unittest', 'i') }, function (error) {
            callback(error);
        });
    };

    /**
     * Test for createnew function
    **/
    UserLocationDTCTests.prototype.createNew = function (callback) {
        var _self = this;
        var newUserLocation = new UserLocationDTO({
            longitude: 11.23,
            latitude: 12.13,
            createdWhen: new Date()
        });

        Async.waterfall([
            function (innerCallback) {
                var DTC = UserLocationDTC.getInstance();
                DTC.createNew(_self._unitTestUser.id, newUserLocation, function (error) {
                    innerCallback(error);
                });
            },

            function (innerCallback) {
                DatabaseContext.User.findOne({ _id: _self._unitTestUser.id }, function (error, userMO) {
                    innerCallback(error, userMO);
                });
            },

            function (userMO, innerCallback) {
                if (Util.isNullOrUndefined(userMO) || Util.isNullOrUndefined(userMO.userLocation)) {
                    Assert.fail();
                }

                Assert.equal(userMO.userLocation[0].longitude, newUserLocation.longitude);
                Assert.equal(userMO.userLocation[0].latitude, newUserLocation.latitude);
                Assert.equal((new Date(userMO.userLocation[0].createdWhen)).getTime(), newUserLocation.createdWhen.getTime());
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
     * Override doTest function of base-test to run test case
    **/
    UserLocationDTCTests.prototype.doTest = function (callback) {
        Async.waterfall([
            this.createNew.bind(this)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = UserLocationDTCTests;
})(module);
