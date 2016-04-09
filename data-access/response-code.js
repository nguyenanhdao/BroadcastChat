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
        'databaseError': 'Database connection error.',

        'userDTCMobileIsRequired': 'Mobile field is required.',
        'userDTCPasswordIsRequired': 'Password field is required.',
        'userDTCFullNameIsRequired': 'User Full name field is required.'
    };


    /**
     * Get message from code
     * @return message for code
    **/
    ResponseCode.getMessage = function (code) {
        var message = code;

        if (!Util.isNullOrUndefined(ErrorCode.Code[code])) {
            message = ErrorCode.Code[code];
        }

        return message;
    };
})(module.exports);
