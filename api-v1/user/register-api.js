//
// Load required module
//
// External library
var Util = require('util');
var Rfr = require('rfr');
var Promise = require('promise');

// Internal library
var UserAuthorizationType = Rfr('api-v1/user-authorization-type.js');
var BaseAPI = Rfr('api-v1/base-api.js');
var SystemLog = Rfr('system-log.js');

(function (module) {
    /**
     * Register new user API
    **/
    function RegisterAPI(parentRouter) {
        
        BaseAPI.call(this, parentRouter, '/register', UserAuthorizationType.UnAuthorizationUser);

    };
    Util.inherits(RegisterAPI, BaseAPI);
    

    RegisterAPI.prototype.run = function (request, response, _self) {
        var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');
        var UserDTO = Rfr('data-access/dtc/user/user-dto.js');

        var userDTO = new UserDTO({
            mobile: request.body.mobile,
            password: request.body.password,
            fullName: request.body.fullName
        });
        
        
        // Check duplicated mobile number first
        UserDTC.getInstance().getByMobile(userDTO.mobile).then(
            function (dto) {
                
                if (Util.isNullOrUndefined(dto)) {

                    UserDTC.getInstance().createNew(userDTO).then(
                        function (dto) {
                            response.send(userDTO);
                            response.end();
                        },
                        function (error) {
                            response.send('Cannot create new user. Error message : ' + error);
                            response.end();
                        }
                    );

                } else {
                    
                    response.send('Existed mobile number.');
                    response.send();

                }

            },
            function (error) {
                
                SystemLog.error(error);
                _self.sendErrorResponse(response, 'INTERAL_SERVER_ERROR', 'Internal Server Error.');
                
            }
        );
    };

    module.exports = RegisterAPI;
})(module); 