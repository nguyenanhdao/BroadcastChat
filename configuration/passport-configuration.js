//
// Reference required library
//
// External modules
var Path = require('path');
var CookieParser = require('cookie-parser');
var Session = require('express-session');
var BodyParser = require('body-parser');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Configuration = require('../configuration.js');
var Rfr = require('rfr');

// Internal modules
var SystemLog = Rfr('system-log.js');

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
                usernameField: 'mobile',
                passwordField: 'password'
            },
            function (mobile, password, callback) {
                var UserDTC = Rfr('data-access/dtc/user/user-dtc.js');

                UserDTC.getInstance().getByMobile(mobile).then(
                    function (userDTO) {
                        if (password === userDTO.password) {
                        
                            userDTO.password = '';
                            callback(null, userDTO);

                        } else {
                        
                            callback('Wrong username or password.', null);

                        };
                    },
                    function (error) {
                        callback('Internal server error.', null);
                        SystemLog.error('Cannot get user from mobile in UserDTC. Error message: ' + error);
                    }
                );
            })
        );
    };

})(module.exports);