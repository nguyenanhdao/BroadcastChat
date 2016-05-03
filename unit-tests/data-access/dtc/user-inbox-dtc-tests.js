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
var UserInboxDTC = Rfr('data-access/dtc/user-inbox/user-inbox-dtc.js');
var UserInboxDTO = Rfr('data-access/dtc/user-inbox/user-inbox-dto.js');
var UserInboxMO = DatabaseContext.UserInbox;
var UserMO = DatabaseContext.User;


(function (module) {

    /**
     * Create new unit test object for UserLocationDTC
    **/
    function UserInboxDTCTests() {
        BaseTest.call(this, 'UserInboxDTC');
    };
    Util.inherits(UserInboxDTCTests, BaseTest);

    /**
     * Setup unit test enviroment
    **/
    UserInboxDTCTests.prototype.setup = function (callback) {
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
    UserInboxDTCTests.prototype.clean = function (callback) {
        var _self = this;
        
        Async.waterfall([
            function (innerCallback) {
                if (Util.isNullOrUndefined(_self._userInboxDTO)) {
                    innerCallback(null);
                    return;
                }
                
                DatabaseContext.UserInbox.remove({ _id: _self._userInboxDTO.id }, function (error) {
                    innerCallback(error);
                });
            },
            
            function (innerCallback) {
                DatabaseContext.User.remove({ fullName: new RegExp('unittest', 'i') }, function (error) {
                    innerCallback(error);
                });
            }
        ],
        
        function(error) {
            callback(error);
        });
    };
    
    /**
     * Test for validation function of UserInboxDTC
    **/
    UserInboxDTCTests.prototype.validate = function (callback) {
        var _self = this;

        // Validate required field
        var userInboxDTO = new UserInboxDTO({
            
        });
        var validationErrors = UserInboxDTC.getInstance().validate(userInboxDTO);
        Assert.notEqual(_.indexOf(validationErrors, 'UserId is required.'), -1);
        

        SystemLog.info(_self._name + ' - test case - validate passed the test.');
        callback(null);
    },

    /**
     * Test for createnew function
    **/
    UserInboxDTCTests.prototype.createNew = function (callback) {
        var _self = this;
        _self._userInboxDTO = new UserInboxDTO({
            userId: _self._unitTestUser.id
        });

        Async.waterfall([
            function (innerCallback) {
                UserInboxDTC.getInstance().createNew(_self._userInboxDTO, function (error, newDTO) {
                    _self._userInboxDTO = newDTO;
                    innerCallback(error);
                });
            },

            function (innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: _self._userInboxDTO.id }, function (error, userInboxMO) {
                    innerCallback(error, userInboxMO);
                });
            },

            function (userInboxMO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO)) {
                    Assert.fail();
                }

                Assert.equal(userInboxMO._id.toString(), _self._userInboxDTO.id);
                Assert.equal(userInboxMO.userId, _self._userInboxDTO.userId);
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
    UserInboxDTCTests.prototype.doTest = function (callback) {
        Async.waterfall([
            this.validate.bind(this),
            this.createNew.bind(this)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = UserInboxDTCTests;
})(module);
