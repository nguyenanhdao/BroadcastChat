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
        
        // user/register
        this.registerAPI(require('./register-api.js'));
        
    };
    
    module.exports = Router;
})(module); 