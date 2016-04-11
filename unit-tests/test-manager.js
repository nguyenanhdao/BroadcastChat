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
     * Initialize unit with specifies POST path
    **/
    TestManager.initialize = function (app) {

        if (Util.isNull(TestManager._instance)) {
            TestManager._instance = new TestManager();
            
            app.post('/unit-tests', TestManager._instance.runTest.bind(TestManager._instance));
        }
    };
    
    /**
     * Load all unit test and execute
    **/
    TestManager.prototype.loadUnitTest = function (callback) {
        var listUnitTestsFolder = Rfr('unit-tests/list-unit-tests.js');
        var folderCount = listUnitTestsFolder.length;
        var FS = require('fs');
        var Path = require('path');
        var results = [];
        
        listUnitTestsFolder.forEach(function (relativeFolderPath, folderIndex) {
            var absoluteFolderPath = 'unit-tests/' + relativeFolderPath;
            var listUnitTestFile = FS.readdirSync(absoluteFolderPath);
            var fileCount = listUnitTestFile.length;

            listUnitTestFile.forEach(function (unitTestFile, fileIndex) {
                var absoluteFilePath = absoluteFolderPath + '/' + unitTestFile;
                var UnitTest = Rfr(absoluteFilePath);
                var unitTestObject = new UnitTest();

                try {
                    unitTestObject.test(function (error) {
                        if (Util.isNullOrUndefined(error)) {
                            results.push({
                                'folder': absoluteFolderPath,
                                'file': absoluteFilePath,
                                'status': 'passed'
                            });
                        }
                        else {
                            results.push({
                                'folder': absoluteFolderPath,
                                'file': absoluteFilePath,
                                'status': 'failed',
                                'detail': JSON.stringify(error)
                            });
                        }

                        if (folderCount === folderIndex + 1 && fileCount === fileIndex + 1) {
                            callback(null, results);
                        }
                    });
                } catch (exc) {
                    results.push({
                        'folder': absoluteFolderPath,
                        'file': absoluteFilePath,
                        'status': 'failed',
                        'detail': JSON.stringify(exc)
                    });

                    if (folderCount === folderIndex + 1 && fileCount === fileIndex + 1) {
                        callback(null, results);
                    }
                }
            });
        });
    };
    
    /**
     * Run unit test
    **/
    TestManager.prototype.runTest = function (request, response) {
        this.loadUnitTest(function (error, results) {
            response.send(results);
            response.end();
        });
    };
    
    
    module.exports = TestManager;
})(module);
