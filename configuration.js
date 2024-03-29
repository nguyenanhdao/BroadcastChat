﻿//
// Reference required library
//
var Path = require('path');

(function (configuration) {    
    configuration.PORT = 3000;
    configuration.APP_ROOT_DIRECTORY = Path.resolve(__dirname);
    configuration.SESSION_SECRET_KEY = 'bobo#$1892@VLSI';
    configuration.MONGODB_URL = 'mongodb://localhost:27017/AbuChatDatabase';
    configuration.DEV_MODE = true;
    
    // TO-DO Move this to SystemConfigurationOptions table
    configuration.MAX_DISTANCE = 0.5; 
})(module.exports);