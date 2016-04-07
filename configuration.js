//
// Reference required library
//
var Path = require('path');

(function (configuration) {    
    configuration.PORT = 3000;
    configuration.APP_ROOT_DIRECTORY = Path.resolve(__dirname);
    configuration.SESSION_SECRET_KEY = 'bobo#$1892@VLSI';
    configuration.MONGODB_URL = 'mongodb://localhost:27017/BroadcastChat';
})(module.exports);