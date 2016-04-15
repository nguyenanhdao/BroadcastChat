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
    var UserLocation = require('./models/user-location.js');
    var PublicMessage = require('./models/public-message.js');

    //
    // Register schema with database context
    //
    DatabaseContext.User = Mongoose.model(User.MODEL_NAME);
    DatabaseContext.UserLocation = Mongoose.model(UserLocation.MODEL_NAME);
    DatabaseContext.PublicMessage = Mongoose.model(PublicMessage.MODEL_NAME);

    module.exports = DatabaseContext;
})(module);
