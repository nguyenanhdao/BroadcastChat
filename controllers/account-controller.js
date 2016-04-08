//
// Load required library
//
// External modules
var Utils = require('util');
var Passport = require('passport');
var Rfr = require('rfr');

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
        
        app.post('/logout', function (request, response) {
            request.logout();
            response.send('Logout !');
            response.end();
        });

        app.post('/login', Passport.authenticate('local', { failureRedirect: '/' }),
            function (request, response) {
                response.send('ok');
        });

        app.post('/register', function (request, response) {
            var userDTO = new UserDTO( {
                mobile: request.body.mobile,
                password: request.body.password,
                fullName: request.body.fullName
            });
            
            UserDTC.getInstance().createNew(userDTO).then(
                function (dto) {
                    response.send('Create user successfully.');
                    response.end();
                },
                function (error) {
                    response.send('Cannot create new user. Error message : ' + error);
                    response.end();
                }
            );
        }); 

        app.post('/testRegister', function (request, response) {
            UserDTC.getInstance().getAll().then(
                function (list) {
                    response.send(list);
                    response.end();
                },
                function (error) {
                    response.send('Cannot get list user. Error message : ' + error);
                    response.end();
                }
            );
        });
    };

    module.exports = AccountController;
})(module);