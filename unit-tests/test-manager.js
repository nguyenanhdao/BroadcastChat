var Rfr = require('rfr');
var Util = require('util');

var UserDTCTests = Rfr('unit-tests/data-access/dtc/user-dtc-tests.js');

(function(TestManager){
    TestManager.initialize = function (app) {
        app.post('/unit-tests', TestManager.runTest);
        app.post('/reset-unit-tests', TestManager.resetDatabase);
    };


    TestManager.resetDatabase = function (request, response) {
        var DatabaseContext = Rfr('data-access/database-context.js');
        DatabaseContext.User.remove({}, function(error) {
            response.send('Reset done.');
            response.end();
        });
    };


    TestManager.runTest = function (request, response) {

        var tests = new UserDTCTests();
        tests.test(function(error){
            if(!Util.isNullOrUndefined(error)) {
                response.send(error);
                response.end();
            } else {
                response.send('ok');
                response.end();
            }
        });
    };
})(module.exports);
