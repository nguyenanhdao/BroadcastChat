//
// Load required library
//
// External modules
var Utils = require('util');
var Passport = require('passport');
var Rfr = require('rfr');
var Async = require('async');

// Internal modules
var BaseController = Rfr('controllers/base-controller.js');
var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
var UserDTO = Rfr('data-access/dtc/user/user-dto.js');


(function (module) {
    //
    // Constructor and inheritance
    //
    function AccountController(application) {
        BaseController.call(this, 'account-controller');

        this.initialize(application);
    };
    Utils.inherits(AccountController, BaseController);
    

    //
    // Methods
    //
    AccountController.prototype.initialize = function (app) {
        var _self = this;

        app.post('/testlogin', function (request, response) {
            
            if (_self.isAuthenticated(request)) {
                response.send('User already login.');
            } else {
                response.send('User not login.');
            }
        });
        
        app.post('/testRegister', function (request, response) {
            UserDTC.getInstance().getAll(function (error, results) {
            
                // Handle error
                if (error != null) {
                    response.send('Cannot get all user data.');
                    response.end();
                    return;
                }

                response.send(results);
                response.end();
            });
        });
    };

    module.exports = AccountController;
})(module);