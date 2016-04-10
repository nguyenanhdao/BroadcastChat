//
// Load required modules
//
// External modules
var Async = require('async');
var Rfr = require('rfr');
var Util = require('util');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();


(function(module){
    function BaseTest(testCaseName) {
        this._name = testCaseName;
    };

    /**
     * Setup enviroment before testing
     * @param callback (error)
    **/
    BaseTest.prototype.setup = function (callback) {
        callback(null);
    };

    /**
     *  Clean up before exit
    **/
    BaseTest.prototype.clean = function (callback) {
        callback(null);
    };

    /**
     * Run unit test
    **/
    BaseTest.prototype.test = function (callback) {
        var _self = this;

        Async.waterfall([
            _self.setup.bind(_self),
            _self.doTest.bind(_self),
            _self.clean.bind(_self)
        ],

        function (error){
            if (Util.isNullOrUndefined(error)) {
                SystemLog.info('Unit test name: ' + _self._name + ' has passed the test.');
                callback(null);
            } else {
                SystemLog.info('Unit test name: ' + _self._name + ' has failed the test.');
                callback(error);
            }
        });
    };

    /**
     * Override this function to run test case
     * @param callback (error)
    **/
    BaseTest.prototype.doTest = function (callback) {
        throw 'DoTest function is not implemented.';
    };


    module.exports = BaseTest;
})(module);
