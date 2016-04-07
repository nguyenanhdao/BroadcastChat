(function (module) {

    function UserAuthorizationType() {
    
    };
    
    UserAuthorizationType.UnAuthorizationUser = 0;
    UserAuthorizationType.AuthorizationUser = 1;
    UserAuthorizationType.AuthorizationAndUnAuthorizationUser = 2;

    module.exports = UserAuthorizationType;
})(module);