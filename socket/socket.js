(function (baseSocket) {

    var socketio = require('socket.io');

    baseSocket.init = function (server) {
        var io = socketio.listen(server);

        io.sockets.on('connection', function (socket) {
            
            console.log('socket was connected.');
            
            socket.emit('showThis', 'this is from server.');


            socket.on('fromClient', function (data) {
                

                console.log('Received message from client : ' + data);

            });
        });
    };

})(module.exports);