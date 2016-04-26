//
// Required modules
//
// External modules
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

// Internal modules
var UserLocation = require('./user-location.js');
var UserInboxMessage = require('./user-inbox-message.js');

(function (UserInbox) {
    UserInbox.MODEL_NAME = 'UserInbox';

    //
    // Define user Schema
    //
    UserInbox.SCHEMA = new Schema({
        userId: {
            type: String,
            unique: true
        },
        
        userInboxMessage: [UserInboxMessage.SCHEMA]
    });

    //
    // Register schema with Mongoose
    //
    UserInbox = Mongoose.model(UserInbox.MODEL_NAME, UserInbox.SCHEMA);

})(module.exports);
