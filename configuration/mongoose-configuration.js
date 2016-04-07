//
// Required library
//
var Mongoose = require('mongoose');

(function (MongooseConfiguration) {
    
    MongooseConfiguration.config = function (mongoDbUrl) {
        Mongoose.connect(mongoDbUrl);
    };

})(module.exports);