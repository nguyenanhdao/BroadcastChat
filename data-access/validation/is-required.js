//
// Required library
//
var Util = require('util');
var _ = require('lodash');

(function (module) {
    
    /**
     * Error message
    **/
    IsRequired.ERROR_MESSAGE = '{0} is required.';
    
    /**
     * Validation function
    **/
    IsRequired.VALIDATOR = function (value) {
        return !Util.isNullOrUndefined(value) && value !== '';
    };

    /**
     * Validate field and return error message
    **/
    function IsRequired(fieldName, fieldValue) {
        if (!IsRequired.VALIDATOR(fieldValue)) {
            return _.replace(IsRequired.ERROR_MESSAGE, '{0}', fieldName);
        }
        return null;
    };
    
    /**
     * Validate field and add error into errors array
    **/
    function IsRequired(fieldName, fieldValue, errors) {
        if (!IsRequired.VALIDATOR(fieldValue)) {
            errors.push(_.replace(IsRequired.ERROR_MESSAGE, '{0}', fieldName));
        }
    };
    
    module.exports = IsRequired;
})(module);