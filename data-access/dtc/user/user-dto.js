(function (module) {


    function UserDTO(obj) {

        if (obj !== null) {
            this.mobile = obj.mobile;
            this.password = obj.password;
            this.fullName = obj.fullName;
            this.createdWhen = obj.createdWhen;
        }

    };

    module.exports = UserDTO;
})(module);
