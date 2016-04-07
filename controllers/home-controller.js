//
// Reference required library
//
var BaseController = require('./base-controller.js');
var utils = require('util');

(function (module) {
    //
    // Constructor and inheritance
    //
    function HomeController(app) {
        BaseController.call(this, 'home-controller');
        
        this.initialize(app);
    };
    utils.inherits(HomeController, BaseController);
    

    //
    // Methods
    //
    HomeController.prototype.initialize = function (app) {
        var _self = this;
        
        app.route('/')
        .get(function (request, response) {
            _self.render(response, 'index');
        });
    };
    

    module.exports = HomeController;
})(module);