//
// Required library
//
var Util = require('util');
var _ = require('lodash');

(function (module) {
    
    /**
     * Error message
    **/
    MinLength.ERROR_MESSAGE = '{0} must has at least {1} characters.';
    
    /**
     * Validation function
    **/
    MinLength.VALIDATOR = function (value, minLength) {
        var length = 0;
        
        if (Util.isString(value) && !Util.isNullOrUndefined(value)) {
            length = value.length;
        }
        
        return length > minLength;
    };

    /**
     * Validate field and add error into errors array
    **/
    function MinLength(fieldName, fieldValue, minLength, errors) {
        if (!MinLength.VALIDATOR(fieldValue, minLength)) {
            
            var errorMessage = _.replace(MinLength.ERROR_MESSAGE, '{0}', fieldName);
            errorMessage = _.replace(errorMessage, '{1}', minLength);
            
            errors.push(errorMessage);
        }
    };
    
    module.exports = MinLength;
})(module);