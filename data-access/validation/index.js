//
// Load required library
//
var IsRequired = require('./is-required.js');
var IsNumberOnly = require('./is-number-only.js');
var MinLength = require('./min-length.js');
var MaxLength = require('./max-length.js');

(function (Validation) {
    
    Validation.isRequired = function (fieldName, fieldValue, errors) {
        return IsRequired(fieldName, fieldValue, errors);
    };

    Validation.isNumberOnly = function (fieldName, fieldValue, errors) {
        return IsNumberOnly(fieldName, fieldValue, errors);
    };
    
    Validation.minLength = function (fieldName, fieldValue, minLength, errors) {
        return MinLength(fieldName, fieldValue, minLength, errors);
    };
    
    Validation.maxLength = function (fieldName, fieldValue, maxLength, errors) {
        return MaxLength(fieldName, fieldValue, maxLength, errors);
    };

})(module.exports);