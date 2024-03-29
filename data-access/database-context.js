﻿//
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
    var PublicMessageReply = require('./models/public-message-reply.js')
    var UserInbox = require('./models/user-inbox.js');
    var UserInboxMessage = require('./models/user-inbox-message.js');

    //
    // Register schema with database context
    //
    DatabaseContext.User = Mongoose.model(User.MODEL_NAME);
    DatabaseContext.UserLocation = Mongoose.model(UserLocation.MODEL_NAME);
    DatabaseContext.PublicMessage = Mongoose.model(PublicMessage.MODEL_NAME);
    DatabaseContext.PublicMessageReply = Mongoose.model(PublicMessageReply.MODEL_NAME);
    DatabaseContext.UserInbox = Mongoose.model(UserInbox.MODEL_NAME);
    DatabaseContext.UserInboxMessage = Mongoose.model(UserInboxMessage.MODEL_NAME);

    module.exports = DatabaseContext;
})(module);
