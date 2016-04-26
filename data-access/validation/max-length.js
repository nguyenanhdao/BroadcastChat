//
// Required library
//
var Util = require('util');
var _ = require('lodash');

(function (module) {
    
    /**
     * Error message
    **/
    MaxLength.ERROR_MESSAGE = '{0} must has maximum {1} characters.';
    
    /**
     * Validation function
    **/
    MaxLength.VALIDATOR = function (value, maxLength) {
        var length = 0;
        
        if (Util.isString(value) && !Util.isNullOrUndefined(value)) {
            length = value.length;
        }
        
        return length < maxLength;
    };

    /**
     * Validate field and add error into errors array
    **/
    function MaxLength(fieldName, fieldValue, maxLength, errors) {
        if (!MaxLength.VALIDATOR(fieldValue, maxLength)) {
            
            var errorMessage = _.replace(MaxLength.ERROR_MESSAGE, '{0}', fieldName);
            errorMessage = _.replace(errorMessage, '{1}', maxLength);
            
            errors.push(errorMessage);
        }
    };
    
    module.exports = MaxLength;
})(module);