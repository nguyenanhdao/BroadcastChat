//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

(function (UserLocation) {
    UserPublicMessage.MODEL_NAME = 'UserPublicMessage';

    //
    // Define user Schema
    //
    UserPublicMessage.SCHEMA = new Schema({
        messageId: {
            type: String,
            require: true
        },

        createdWhen: {
            type: Date,
            default: Date.now
        }
    });

    //
    // Register schema with Mongoose
    //
    UserPublicMessage = Mongoose.model(UserPublicMessage.MODEL_NAME, UserPublicMessage.SCHEMA);

})(module.exports);
