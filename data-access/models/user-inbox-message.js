//
// Required modules
//
// External modules
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

(function (UserInboxMessage) {
    UserInboxMessage.MODEL_NAME = 'UserInboxMessage';

    //
    // Define user Schema
    //
    UserInboxMessage.SCHEMA = new Schema({
        publicMessageId: {
            type: String,
            unique: true
        },

        hasSeen: {
            type: Boolean,
            default: false
        }
    });

    //
    // Register schema with Mongoose
    //
    UserInboxMessage = Mongoose.model(UserInboxMessage.MODEL_NAME, UserInboxMessage.SCHEMA);

})(module.exports);
