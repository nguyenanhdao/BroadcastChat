//
// Required library
//
var Util = require('util');
var _ = require('lodash');

(function (module) {
    /**
     * Error message
    **/
    IsNumberOnly.ERROR_MESSAGE = '{0} must contains only numbers.';
    IsNumberOnly.NUMBER_ONLY_REGEX = new RegExp('^[0-9]+$');

    /**
     * Validation function
    **/
    IsNumberOnly.VALIDATOR = function (fieldValue) {
        if (Util.isNullOrUndefined(fieldValue)) {
            return true;
        }
        
        return IsNumberOnly.NUMBER_ONLY_REGEX.test(fieldValue);
    };
    
    /**
     * Validate field and return error message
    **/
    function IsNumberOnly(fieldName, fieldValue) {
        if (!IsNumberOnly.VALIDATOR(fieldValue)) {
            return _.replace(IsNumberOnly.ERROR_MESSAGE, '{0}', fieldName);
        }
        return null;
    };
    
    /**
     * Validate field and add error into errors array
    **/
    function IsNumberOnly(fieldName, fieldValue, errors) {
        if (!IsNumberOnly.VALIDATOR(fieldValue)) {
            errors.push(_.replace(IsNumberOnly.ERROR_MESSAGE, '{0}', fieldName));
        }
    };
    
    module.exports = IsNumberOnly;
})(module);