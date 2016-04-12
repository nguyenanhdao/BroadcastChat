//
// Required modules
//
// External modules
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Rfr = require('rfr');

// Internal modules
var UserLocation = require('./user-location.js');


(function (User) {
    User.MODEL_NAME = 'User';

    //
    // Define user Schema
    //
    User.SCHEMA = new Schema({
        mobile: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        fullName: {
            type: String
        },
        createdWhen: {
            type: Date,
            default: Date.now
        },
        meta: {
            avatarUrl: String
        },

        // Define sub document
        userLocation: [UserLocation.SCHEMA]
    });

    //
    // Register schema with Mongoose
    //
    User = Mongoose.model(User.MODEL_NAME, User.SCHEMA);

})(module.exports);
