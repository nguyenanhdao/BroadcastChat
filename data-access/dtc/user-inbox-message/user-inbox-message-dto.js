(function (module) {

    function UserInboxMessageDTO(obj) {

        if (obj !== null) {
            this.id = obj.id;
            this.publicMessageId = obj.publicMessageId;
            this.hasSeen = obj.hasSeen;
            this.createdWhen = obj.createdWhen;
        }

    };

    module.exports = UserInboxMessageDTO;
})(module);
