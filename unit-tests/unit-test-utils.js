//
// Load require modules
//
// Load external module
var Rfr = require('rfr');
var Async = require('async');

// Load internal module
var DatabaseContext = Rfr('data-access/database-context.js');

(function (UnitTestUtils) {

    /**
     * Create new user for unittest
     * @param callback - function (error, newUserMO)
    **/
    UnitTestUtils.createNewUser = function (callback) {
        var UserMO = DatabaseContext.User;

        Async.waterfall([
            function (innerCallback) {
                var newUser = new UserMO({
                    mobile: '0914090540',
                    fullName: 'UnitTest fullname',
                    password: 'UnitTest password',
                    createdWhen: Date.now()
                });

                newUser.save(function (error) {
                    innerCallback(error, newUser);
                });
            }
        ],

        function (error, newUser) {
            callback(error, newUser);
        });
    };


})(module.exports);
