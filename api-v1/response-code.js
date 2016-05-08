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
        
        // Security stuff
        'accessDenied': 'Access Denined.',
        'ilegalUserStatus': 'Ilegal user status.',
        'lockedUser': 'User account has been locked.',
        'loginWrongMobileOrPassword': 'Wrong mobile number or password',

        // API Errors
        'userLoginMobileIsRequired': 'Mobile field is required.',
        'userLoginNotExistedMobileNumber': 'Mobile number is not existed.',
        'userLoginWrongPassword': 'Wrong password.',
        'userLoginTestLoginNotLogin': 'User is not loged in.',
        'userRegisterValidationFailed': 'Validation failed.',
        
        'publicMessageDeletePublicMessageIdIsRequired': 'Public Message Id is required.',
        'publicMessageDeletePublicMessageNotExisted': 'Public Message is not existed',
        'publicMessageDeletePublicMessageWrongMobileNumber': 'This message does not belong to user.',
        
        'publicMessageReplyDeletePublicMessageReplyPublicMessageIdIsRequired': 'Public Message Id is required.',
        'publicMessageReplyDeletePublicMessageReplyPublicMessageReplyIdIsRequired': 'Public Message Reply Id is required.',
        'publicMessageReplyDeletePublicMessageReplyWrongMobileNumber': 'This message does not belong to user.',
        'publicMessageReplyDeletePublicMessageReplyNotExisted': 'Public message reply is not existed.'
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
