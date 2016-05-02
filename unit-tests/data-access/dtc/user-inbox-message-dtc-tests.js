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
var UserInboxMessageDTC = Rfr('data-access/dtc/user-inbox-message/user-inbox-message-dtc.js');
var UserInboxMessageDTO = Rfr('data-access/dtc/user-inbox-message/user-inbox-message-dto.js');
var UserInboxMO = DatabaseContext.UserInbox;
var UserMO = DatabaseContext.User;
var UserInboxMessageMO = DatabaseContext.UserInboxMessage;

(function (module) {

    /**
     * Create new unit test object for UserLocationDTC
    **/
    function UserInboxMessageDTCTests() {
        BaseTest.call(this, 'UserInboxMessageDTC');
    };
    Util.inherits(UserInboxMessageDTCTests, BaseTest);

    /**
     * Setup unit test enviroment
    **/
    UserInboxMessageDTCTests.prototype.setup = function (callback) {
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
    UserInboxMessageDTCTests.prototype.clean = function (callback) {
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
     * Test for validation function of UserInboxMessageDTC
    **/
    UserInboxMessageDTCTests.prototype.validate = function (callback) {
        var _self = this;

        // Validate required field
        var userInboxMessageDTO = new UserInboxMessageDTO({
            
        });
        var validationErrors = UserInboxMessageDTC.getInstance().validate(userInboxMessageDTO);
        Assert.notEqual(_.indexOf(validationErrors, 'PublicMessageId is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'CreatedWhen is required.'), -1);
        
        SystemLog.info(_self._name + ' - test case - validate passed the test.');
        callback(null);
    },

    /**
     * Test for createnew function
    **/
    UserInboxMessageDTCTests.prototype.createNew = function (callback) {
        var _self = this;
        _self._userInboxDTO = new UserInboxDTO({
            userId: _self._unitTestUser.id
        });

        Async.waterfall([
            // Create user inbox and user inbox message
            function (innerCallback) {
                UserInboxDTC.getInstance().createNew(_self._userInboxDTO, function (error, newDTO) {
                    _self._userInboxDTO = newDTO;
                    innerCallback(error);
                });
            },
            function (innerCallback) {
                var userInboxMessageDTO = new UserInboxMessageDTO({
                    publicMessageId: 'publicMessageId',
                    createdWhen: new Date()
                });
                
                UserInboxMessageDTC.getInstance().createNew(_self._userInboxDTO.id, userInboxMessageDTO, function (error, newDTO) {
                    innerCallback(error, newDTO);
                });
            },
            
            // Get directly new object from database and compare
            function (newDTO, innerCallback) {
                DatabaseContext.UserInbox.findOne({ _id: _self._userInboxDTO.id }, function (error, userInboxMO) {
                    innerCallback(error, userInboxMO, newDTO);
                });
            },
            function (userInboxMO, newDTO, innerCallback) {
                if (Util.isNullOrUndefined(userInboxMO) || Util.isNullOrUndefined(userInboxMO.userInboxMessage.id(newDTO.id))) {
                    Assert.fail();
                }
                
                var userInboxMessageMO = userInboxMO.userInboxMessage.id(newDTO.id);
                Assert.equal(userInboxMessageMO._id.toString(), newDTO.id);
                Assert.equal(userInboxMessageMO.publicMessageId, newDTO.publicMessageId);
                Assert.equal((new Date(userInboxMessageMO.createdWhen)).getTime(), newDTO.createdWhen.getTime());
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
    UserInboxMessageDTCTests.prototype.doTest = function (callback) {
        Async.waterfall([
            this.validate.bind(this),
            this.createNew.bind(this)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = UserInboxMessageDTCTests;
})(module);
