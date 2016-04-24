(function (module) {


    function UserDTO(obj) {

        if (obj !== null) {
            this.id = obj.id;
            this.mobile = obj.mobile;
            this.password = obj.password;
            this.fullName = obj.fullName;
            this.createdWhen = obj.createdWhen;
            this.status = obj.status;
            this.authorizationType = obj.authorizationType;
        }

    };

    module.exports = UserDTO;
})(module);
