//
// Load required modules
//
// External module
var Express = require('express');
var Rfr = require('rfr');

// Internal module
var UserRouter = Rfr('api-v1/user/router.js');
var PublicMessageRouter = Rfr('api-v1/public-message/router.js');

(function (module) {
    function MainRouter(app) {

        this._router = Express.Router();
        app.use('/api-v1', this._router);

        this.registerRoute();

    };

    /**
     * Register child route
    **/
    MainRouter.prototype.registerRoute = function () {

        // Register router api-v1/user/
        this._userRoute = new UserRouter(this._router);

        // Register ruoter api-v1/public-messsage/
        this._publicMessageRoute = new PublicMessageRouter(this._router);
    };

    module.exports = MainRouter;
})(module);
