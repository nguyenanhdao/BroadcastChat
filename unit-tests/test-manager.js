var Rfr = require('rfr');
var Util = require('util');

var UserDTCTests = Rfr('unit-tests/data-access/dtc/user-dtc-tests.js');

(function(TestManager){
    TestManager.initialize = function (app) {
        app.post('/unit-tests', TestManager.runTest);
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
