(function (module) {


    function UserLocationDTO(obj) {

        if (obj !== null) {
            this.id = obj.id;
            this.longitude = obj.longitude;
            this.latitude = obj.latitude;
            this.createdWhen = obj.createdWhen;
        }

    };

    module.exports = UserLocationDTO;
})(module);
