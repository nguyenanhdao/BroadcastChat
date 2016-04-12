//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

(function (UserLocation) {
    UserLocation.MODEL_NAME = 'UserLocation';

    //
    // Define user Schema
    //
    UserLocation.SCHEMA = new Schema({
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
        }
    });

    //
    // Register schema with Mongoose
    //
    UserLocation = Mongoose.model(UserLocation.MODEL_NAME, UserLocation.SCHEMA);

})(module.exports);
