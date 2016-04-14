//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

(function (PublicMessage) {
    PublicMessage.MODEL_NAME = 'PublicMessage';

    //
    // Define public message
    //
    PublicMessage.SCHEMA = new Schema({
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
    PublicMessage = Mongoose.model(PublicMessage.MODEL_NAME, PublicMessage.SCHEMA);

})(module.exports);
