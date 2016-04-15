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
            type: Number,
            require: true
        },

        latitude: {
            type: Number,
            require: true
        },

        createdWhen: {
            type: Date,
            default: Date.now
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
