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
        BaseRouter.call(this, parentRouter, '/public-message');
    };
    Util.inherits(Router, BaseRouter);

    /**
     * Override registerRoute of BaseRouter
     * Register nested route
    **/
    Router.prototype.registerRoute = function (parentRouter) {

        // PUBLIC MESSAGE API
        this.registerAPI(require('./create-api.js'));     // public-message/create
        this.registerAPI(require('./delete-api.js'));     // public-message/delete
    };

    module.exports = Router;
})(module);
