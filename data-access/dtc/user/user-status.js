(function (module) {

    function UserStatus() {

    };

    UserStatus.Any = 3;
    UserStatus.ActiveUser = 5 * UserStatus.Any;
    UserStatus.LockedUser = 7 * UserStatus.Any;
    UserStatus.WaitForActivation = 9 * UserStatus.Any;
    
    UserStatus.isLockedUser = function (userDTO) {
        return userDTO.status === UserStatus.LockedUser;
    };
    
    UserStatus.isLegal = function (userStatus, requiredStatus) {
        return userStatus % requiredStatus === 0;
    };

    module.exports = UserStatus;
})(module);