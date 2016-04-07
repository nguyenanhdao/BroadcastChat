//
// Load required library
//
var IsRequired = require('./is-required.js');
var IsNumberOnly = require('./is-number-only.js');

(function (Validation) {
    
    /**
     * Is Required validation
     *
    **/
    Validation.isRequired = function (fieldName, fieldValue) {
        return IsRequired(fieldName, fieldValue);
    };
    Validation.isRequired = function (fieldName, fieldValue, errors) {
        return IsRequired(fieldName, fieldValue, errors);
    };

    /**
     * Is Number Only
     *
    **/
    Validation.isNumberOnly = function (fieldName, fieldValue) {
        return IsNumberOnly(fieldName, fieldValue);
    };
    Validation.isNumberOnly = function (fieldName, fieldValue, errors) {
        return IsNumberOnly(fieldName, fieldValue, errors);
    };

})(module.exports);