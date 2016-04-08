//
// Required library
//
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Validation = require('../validation');

(function (User) {
    User.MODEL_NAME = 'User';
    
    //
    // Define user Schema
    //
    var userSchema = new Schema({

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

        meta: {
            avatarUrl: String
        }
    });
    
    //
    // Register schema with Mongoose
    //
    User = Mongoose.model(User.MODEL_NAME, userSchema);

})(module.exports);