//
// Reference required library
//
var configuration = require('../configuration.js');
var _ = require('lodash');

(function (module) {
    function BaseController(controllerName) {
        this.controllerName = controllerName;
    };
    
    BaseController.prototype.render = function (response, viewName, model) {
        var controller = this.controllerName.replace('-controller', '');

        var viewPath = configuration.APP_ROOT_DIRECTORY + '\\views\\' + controller + '\\' + viewName;
        response.render(viewPath, model);
    };
    
    BaseController.prototype.isAuthenticated = function (request) {
        if (request != null && request.user != null) {
            return true;
        }
        return false;
    };
    

    module.exports = BaseController;
})(module);