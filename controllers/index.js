//
// Required library
//
var HomeController = require('./home-controller.js');
var AccountController = require('./account-controller.js');

(function (module) {

    function Controllers(app) {
        this.homeController = new HomeController(app);
        this.accountController = new AccountController(app);
    };


    module.exports = Controllers;
})(module);