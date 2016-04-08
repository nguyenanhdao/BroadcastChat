//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');
var Passport = require('passport');
var BodyParser = require('body-parser');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');

(function (module) {
    /**
     * Logout API
    **/
    function LogoutAPI(parentRouter) {
        
        BaseAPI.call(this, parentRouter, '/logout', UserAuthorizationType.UnAuthorizationUser);
        
    };
    Util.inherits(LogoutAPI, BaseAPI);
    
    LogoutAPI.prototype.run = function (request, response) {
        request.logout();
        response.send('Logout successfull.');
        response.end();
    };

    module.exports = LogoutAPI;
})(module); 