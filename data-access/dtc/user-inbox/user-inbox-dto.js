(function (module) {

    function UserInboxDTO(obj) {

        if (obj !== null) {
            this.id = obj.id;
            this.userId = obj.userId;
            this.userInboxMessage = obj.userInboxMessage;
        }

    };

    module.exports = UserInboxDTO;
})(module);
