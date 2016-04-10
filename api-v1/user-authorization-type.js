//
// Load required modules
//
// External module
var Util = require('util');

(function (module) {

    function UserAuthorizationType() {
    
    };
    
    UserAuthorizationType.UnAuthorizationUser = 0;
    UserAuthorizationType.AuthorizationUser = 1;
    UserAuthorizationType.AuthorizationAndUnAuthorizationUser = 2;
    
    /**
     * Check two authorization are the same
     * @param current user authorization
     * @param required authorization
     * @return true if two authorization are the same type
    **/
    UserAuthorizationType.isEqual = function (currentAuthorization, requiredAuthorization) {
        var result = currentAuthorization === requiredAuthorization;

        // Handle special case for UnAuthorizedUser
        // Undefined or null has the same meaning with UnAuthorizedUser
        if (!result && requiredAuthorization === UserAuthorizationType.UnAuthorizationUser) {
            result = Util.isNullOrUndefined(currentAuthorization);
        }

        return result;
    };

    module.exports = UserAuthorizationType;
})(module);