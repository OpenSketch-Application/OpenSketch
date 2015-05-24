module.exports = function(io) {
  // Start socket and listen for incoming connections
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

};
