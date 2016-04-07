//
// Reference required library
//
var Http = require('http');
var Configuration = require('./configuration.js');
var Express = require('express');
var Controllers = require('./controllers');
var Path = require('path');

(function () {
    // Create and setup for express application
    var app = Express();
    var server = Http.Server(app);
    
    // Setting up MVC
    app.set('view engine', 'vash');
    app.use(Express.static(Path.resolve(__dirname + "/public")));
    
    // Config passport for authentication
    require('./configuration/passport-configuration.js').config(app);
    require('./configuration/mongoose-configuration.js').config(Configuration.MONGODB_URL);

    // Create and setup for socket.io
    var socket = require('./socket/socket.js');
    socket.init(server);
    
    // Create controller to handle request and start server
    var controllers = new Controllers(app);
    server.listen(Configuration.PORT);
    console.log('Server has been started and listen at port number : ' + Configuration.PORT);
})();