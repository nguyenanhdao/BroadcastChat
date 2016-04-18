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
var PublicMessageReplyDTC = Rfr('data-access/dtc/public-message-reply/public-message-reply-dtc.js');
var PublicMessageReplyDTO = Rfr('data-access/dtc/public-message-reply/public-message-reply-dto.js');
var PublicMessageDTO = Rfr('data-access/dtc/public-message/public-message-dto.js');
var PublicMessageDTC = Rfr('data-access/dtc/public-message/public-message-dtc.js');
var PublicMessageReplyMO = DatabaseContext.PublicMessageReply;


(function (module) {

    /**
     * Create new unit test object for PublicMessageReplyDTCTests
    **/
    function PublicMessageReplyDTCTests() {
        BaseTest.call(this, 'PublicMessageReplyDTCTests');
    };
    Util.inherits(PublicMessageReplyDTCTests, BaseTest);

    /**
     * Setup unit test enviroment
    **/
    PublicMessageReplyDTCTests.prototype.setup = function (callback) {
        var _self = this;

        Async.waterfall([
            // Clean and create new user for unittest
            _self.clean.bind(_self),
            function (innerCallback) {
                UnitTestUtils.createNewUser(function (error, newUser) {
                    _self._unitTestUser = newUser;
                    innerCallback(error);
                });
            },


            // Create new public message
            function (innerCallback) {
                var publicMessageDTO = new PublicMessageDTO({
                    message: 'unittest',
                    longitude: 11.23,
                    latitude: 12.13,
                    createdWhen: new Date(),
                    createdWho: _self._unitTestUser.mobile
                });
                PublicMessageDTC.getInstance().createNew(publicMessageDTO, innerCallback);
            },


            // Create new public message reply
            function (publicMessageDTO, innerCallback) {
                _self._publicMessageDTO = publicMessageDTO;
                innerCallback(null);
            }
        ],

        function (error) {
            callback(error);
        });
    };

    /**
     * Clean up unittest resouces
    **/
    PublicMessageReplyDTCTests.prototype.clean = function (callback) {
        this._unitTestUser = null;

        // Remove all users have name start with unittest
        DatabaseContext.User.remove({ fullName: new RegExp('unittest', 'i') }, function (error) {
            callback(error);
        });
    };

    /**
     * Test for createnew function
    **/
    PublicMessageReplyDTCTests.prototype.createNew = function (callback) {
        var _self = this;
        var publicMessageDTO = new PublicMessageDTO({
            message: 'unittest',
            longitude: 11.23,
            latitude: 12.13,
            createdWhen: new Date(),
            createdWho: '0914090540'
        });

        Async.waterfall([
            function (innerCallback) {
                PublicMessageDTC.getInstance().createNew(publicMessageDTO, function (error, dto) {
                    publicMessageDTO = dto;
                    innerCallback(error);
                });
            },

            function (innerCallback) {
                DatabaseContext.PublicMessage.findOne({ _id: publicMessageDTO.id }, function (error, publicMessageMO) {
                    innerCallback(error, publicMessageMO);
                });
            },

            function (publicMessageMO, innerCallback) {

                if (Util.isNullOrUndefined(publicMessageMO)) {
                    Assert.fail();
                }

                Assert.equal(publicMessageMO._id, publicMessageDTO.id);
                Assert.equal(publicMessageMO.longitude, publicMessageDTO.longitude);
                Assert.equal(publicMessageMO.latitude, publicMessageDTO.latitude);
                Assert.equal(publicMessageMO.createdWho, publicMessageDTO.createdWho);
                Assert.equal(publicMessageMO.message, publicMessageDTO.message);
                Assert.equal((new Date(publicMessageMO.createdWhen)).getTime(), publicMessageDTO.createdWhen.getTime());
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
     *
    **/
    PublicMessageDTCTests.prototype.validate = function (callback) {
        var _self = this;

        // Validate required field
        var publicMessageDTO = new PublicMessageDTO({
        });

        var validationErrors = PublicMessageDTC.getInstance().validate(publicMessageDTO);
        Assert.notEqual(_.indexOf(validationErrors, 'Message is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Longitude is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Latitude is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Created When is required.'), -1);
        Assert.notEqual(_.indexOf(validationErrors, 'Created Who is required.'), -1);

        SystemLog.info(_self._name + ' - test case - validate passed the test.');
        callback(null);
    };

    /**
     * Override doTest function of base-test to run test case
    **/
    PublicMessageDTCTests.prototype.doTest = function (callback) {
        var _self = this;

        Async.waterfall([
            _self.createNew.bind(_self),
            _self.validate.bind(_self)
        ],

        function (error) {
            callback(error);
        });
    };


    module.exports = PublicMessageDTCTests;
})(module);