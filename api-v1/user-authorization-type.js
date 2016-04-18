//
// Load required modules
//
// External module
var Util = require('util');

(function (module) {

    function UserAuthorizationType() {

    };

    UserAuthorizationType.UnAuthorizationUser = 3;
    UserAuthorizationType.AuthorizationUser = 5;
    UserAuthorizationType.AuthorizationAndUnAuthorizationUser = UserAuthorizationType.UnAuthorizationUser * UserAuthorizationType.AuthorizationUser;

    /**
     * Check two authorization are the same
     * @param current user authorization
     * @param required authorization
     * @return true if two authorization are the same type
    **/
    UserAuthorizationType.isEqual = function (currentAuthorization, requiredAuthorization) {
        // Standard parameter
        if (Util.isNullOrUndefined(currentAuthorization)) {
            currentAuthorization = UserAuthorizationType.UnAuthorizationUser;
        }
        
        return requiredAuthorization % currentAuthorization === 0;
    };

    module.exports = UserAuthorizationType;
})(module);
