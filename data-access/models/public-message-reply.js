//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

(function (PublicMessageReply) {
    PublicMessageReply.MODEL_NAME = 'PublicMessageReply';

    //
    // Define public message
    //
    PublicMessageReply.SCHEMA = new Schema({
        message: {
            type: String,
            require: true
        },

        longitude: {
            type: Number
        },

        latitude: {
            type: Number
        },

        createdWhen: {
            type: Date,
            default: Date.now,
            require: true
        },

        createdWho: {
            type: String,
            require: true
        }
    });

    //
    // Register schema with Mongoose
    //
    PublicMessageReply = Mongoose.model(PublicMessageReply.MODEL_NAME, PublicMessageReply.SCHEMA);

})(module.exports);
