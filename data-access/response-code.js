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

        'userDTCDuplicatedMobileNumber': 'Duplicated mobile number.',
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
