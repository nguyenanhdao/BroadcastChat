//
// Required library
//
var Mongoose = require('mongoose');
var Configuration = require('../configuration.js');
var Promise = require('promise');

(function (module) {
    function DatabaseContext() {
            
    };
    
    //
    // Load models
    //
    var User = require('./models/user.js');
    
    //
    // Register schema with database context
    //
    DatabaseContext.User = Mongoose.model(User.MODEL_NAME);

    module.exports = DatabaseContext;
})(module);