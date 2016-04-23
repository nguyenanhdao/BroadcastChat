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
        BaseRouter.call(this, parentRouter, '/public-message-reply');
    };
    Util.inherits(Router, BaseRouter);

    /**
     * Override registerRoute of BaseRouter
     * Register nested route
    **/
    Router.prototype.registerRoute = function (parentRouter) {

        // CREATE PUBLIC MESSAGE REPLY
        this.registerAPI(require('./create-api.js'));     // public-message-reply/create
        this.registerAPI(require('./delete-api.js'));     // public-message-reply/delete

    };

    module.exports = Router;
})(module);
