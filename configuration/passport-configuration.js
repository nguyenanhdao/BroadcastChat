//
// Reference required library
//
var Path = require('path');
var CookieParser = require('cookie-parser');
var Session = require('express-session');
var BodyParser = require('body-parser');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Configuration = require('../configuration.js');

(function (passportConfiguration) {

    passportConfiguration.config = function (app) {
        
        // Use cookie parser middleware
        app.use(CookieParser());
        app.use(Session({ secret: Configuration.SESSION_SECRET_KEY }));
        
        // Parse json data from body
        app.use(BodyParser.json());
        app.use(BodyParser.urlencoded());
        
        // Passport
        app.use(Passport.initialize());
        app.use(Passport.session());
        
        // Serialize user
        Passport.serializeUser(function (user, callback) {
            callback(null, user);
        });
        Passport.deserializeUser(function (user, callback) {
            callback(null, user);
        });
        
        // Authentication strategy
        Passport.use(new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            function (username, password, callback) {
                
                // TO-DO implement real authentication here
                console.log('Validation user running..');
                
                if (username === 'nguyendauit' && password === 'bobo#$1892') {
                    var user = {
                        username: username
                    };
                    
                    callback(null, user);
                }
                else {
                    callback('Invalid login.', null);
                }
            })
        );
    };

})(module.exports);