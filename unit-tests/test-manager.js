//
// Load required modules
//
// External modules
var Rfr = require('rfr');
var Util = require('util');
var Async = require('async');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();

(function (module) {
    function TestManager() {

    };

    /**
     * Test manager singleton
    **/
    TestManager._instance = null;

    /**
     *  Get instance of TestManager
    **/
    TestManager.getInstance = function () {
        return TestManager._instance;
    };

    /**
     * Recursion function to execute all unittest in list
    **/
    TestManager.prototype.next = function (callback, results, index, listUnitTest) {
        // Check out of index
        if(index === listUnitTest.length)
        {
            callback(results);
            return;
        }

        // Execute unit test
        var UnitTest = Rfr(listUnitTest[index]);
        var unitTestObject = new UnitTest();
        var _self = this;

        try {
            unitTestObject.test(function (error) {
                if (Util.isNullOrUndefined(error)) {
                    results.push({
                        'file': listUnitTest[index],
                        'status': 'passed'
                    });
                }
                else {
                    results.push({
                        'file': listUnitTest[index],
                        'status': 'failed',
                        'detail': JSON.stringify(error)
                    });
                }
                _self.next(callback, results, index + 1, listUnitTest);
            });
        } catch (exc) {
            results.push({
                'file': listUnitTest[index],
                'status': 'failed',
                'detail': JSON.stringify(exc)
            });
            _self.next(callback, results, index + 1, listUnitTest);
        }
    },

    /**
     * Initialize unit with specifies POST path
    **/
    TestManager.initialize = function (app) {

        if (Util.isNull(TestManager._instance)) {
            TestManager._instance = new TestManager();

            app.post('/unit-tests', TestManager._instance.runTest.bind(TestManager._instance));
        }
    };

    /**
     * Get all unit test file's path
    **/
    TestManager.prototype.loadUnitTest = function () {
        var listUnitTestsFolder = Rfr('unit-tests/list-unit-tests.js');
        var Path = require('path');
        var FS = require('fs');
        var results = [];

        listUnitTestsFolder.forEach(function (relativeFolderPath) {
            var absoluteFolderPath = 'unit-tests/' + relativeFolderPath;
            var listUnitTestFile = FS.readdirSync(absoluteFolderPath);

            listUnitTestFile.forEach(function (unitTestFile) {
                results.push(absoluteFolderPath + '/' + unitTestFile);
            });
        });

        return results;
    };

    /**
     * Run unit test
    **/
    TestManager.prototype.runTest = function (request, response) {

        var unitTestResults = [];
        var listUnitTest = this.loadUnitTest();

        this.next(function(results){
            response.send(results);
            response.end();
        }, unitTestResults, 0, listUnitTest);
    };


    module.exports = TestManager;
})(module);
