﻿//
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
var Util = require('util');

// Internal modules
var SystemLog = Rfr('system-log.js').getInstance();
var UserStatus = Rfr('data-access/dtc/user/user-status.js');

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
                
                UserDTC.getInstance().getByMobile(mobile, function (error, userDTO) {
                    // Handle error
                    if (!Util.isNullOrUndefined(error)) {
                        SystemLog.error('Cannot get user from mobile in UserDTC. Error message: ' + error);
                        callback('internalError', null);
                    }
                    
                    if (userDTO.status === UserStatus.LockedUser) {
                        callback('lockedUser');
                    } else if (Util.isNullOrUndefined(userDTO)) {
                        callback('userLoginNotExistedMobileNumber');
                    } else if (password !== userDTO.password) {
                        callback('loginWrongMobileOrPassword');
                    } else {
                        callback(null, userDTO);
                    }
                });
            })
        );
    };

})(module.exports);