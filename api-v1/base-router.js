//
// Load required models
//
// External module
var Express = require('express');

(function (module) {
    /**
     * Create new Router
     * @param parentRouter parent router
     * @param routePath path
    **/
    function BaseRouter(parentRouter, routePath) {

        this._apis = [];                     // Handle apis
        this._routerPath = routePath;        // Router path
        this._router = Express.Router();     // New router to handle nested route

        // Register api through this router
        this.registerRoute(this._router);

        // Attach new route to parentRoute
        parentRouter.use(this._routerPath, this._router);
    };

    /**
     * Register child route and handle object for each api
     * Must override this function
    **/
    BaseRouter.prototype.registerRoute = function (_router) {

        throw 'RegisterRoute function is not implemented.';

    };

    /**
     * Register api
    **/
    BaseRouter.prototype.registerAPI = function (API) {
        this._apis.push(new API(this._router));
    };

    module.exports = BaseRouter;
})(module);
