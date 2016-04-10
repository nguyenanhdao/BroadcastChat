//
// Load required modules
//
// External module
var Rfr = require('rfr');
var Util = require('util');

// Internal module
var BaseRouter = Rfr('api-v1/base-router.js');

(function (module) {

    function Router(parentRouter) {
        BaseRouter.call(this, parentRouter, '/user');
    };
    Util.inherits(Router, BaseRouter);
    
    /**
     * Override registerRoute of BaseRouter
     * Register nested route
    **/
    Router.prototype.registerRoute = function (parentRouter) {
        
        // USER API
        this.registerAPI(require('./register-api.js'));     // user/register
        this.registerAPI(require('./login-api.js'));        // user/login
        this.registerAPI(require('./logout-api.js'));     // user/logout
    };
    
    module.exports = Router;
})(module); 