//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Validation = require('../validation');

(function (UserLocation) {
    UserLocation.MODEL_NAME = 'UserLocation';

    //
    // Define user Schema
    //
    var userLocationSchema = new Schema({
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
    UserLocation = Mongoose.model(UserLocation.MODEL_NAME, userLocationSchema);

})(module.exports);
