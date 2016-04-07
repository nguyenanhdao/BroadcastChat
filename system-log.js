//
// Load required modules
//
// External modules
var Promise = require('promise');

(function (module) {
    function SystemLog() { };
    
    /**
     * Instance reference, follows singleton pattern
    **/
    var instance = null;
    
    /**
     * Get instance of SystemLog
    **/
    SystemLog.getInstance = function () {
        if (instance == null) {
            instance = new SystemLog();
        }

        return instance;
    };
    
    /**
     * Log error
    **/
    SystemLog.prototype.error = function (message, exception) {
        message = message || '';
        exception = exception || '';

        console.log('Error Message: ' + message);
        console.log('Exception message: ' + exception);
    };
    
    /**
     * Log info
    **/
    SystemLog.prototype.info = function (message) {
        message = message || '';
        
        console.log('Info Message: ' + message);
    };
    
    /**
     * Log warning
    **/
    SystemLog.prototype.warn = function (message) {
        message = message || '';

        console.log('Warn Message: ' + message);
    };
    

    module.exports = SystemLog;
})(module);