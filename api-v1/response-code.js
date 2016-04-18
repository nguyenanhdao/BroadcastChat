//
// Load required modules
//
// External module
var Util = require('util');

(function (ResponseCode) {
    /**
     * Code collection
     * Must store as Alphabet order
    **/
    ResponseCode.Code = {
        // Successfull code and message
        'ok': 'Ok',

        // Internal server error
        'internalError': 'Internal server error.',

        // API Errors
        'userLoginMobileIsRequired': 'Mobile field is required.',
        'userLoginNotExistedMobileNumber': 'Mobile number is not existed.',
        'userLoginWrongPassword': 'Wrong password.',
        'userRegisterValidationFailed': 'Validation failed.'
    };


    /**
     * Get message from code
     * @return message for code
    **/
    ResponseCode.getMessage = function (code) {
        var message = code;

        if (!Util.isNullOrUndefined(ResponseCode.Code[code])) {
            message = ResponseCode.Code[code];
        }

        return message;
    };
})(module.exports);
