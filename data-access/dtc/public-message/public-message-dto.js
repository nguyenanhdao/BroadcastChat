(function (module) {

    function PublicMessageDTO (obj) {
        if (obj !== null) {
            this.id = obj._id;
            this.message = obj.message;
            this.longitude = obj.longitude;
            this.latitude = obj.latitude;
            this.createdWhen = obj.createdWhen;
            this.createdWho = obj.createdWho;
        }
    };

    module.exports = PublicMessageDTO;
})(module);
