var CanvasSession = require('../db/models/CanvasSession');

var WhiteboardSocketHandler = {};

// whiteboardSocketHandler.init(io, sessionSettings);
WhiteboardSocketHandler.init = function(io, sessionSettings) {
  var _this = this;
  console.log('initializing WBSocketHandler', sessionSettings);

  //create new namespace
  var nsp = io.of('/whiteboard/' + sessionSettings.id);

  nsp.on('connection', function(socket) {
    console.log('user conected to namespace', sessionSettings.id);
    socket.emit('userJoining', 'user joined session' + sessionSettings.id);
    // Probably need to check cookie info, to ensure this user is not restricted
    // to this Session Id, parse cookie values in header
    /*
      socket.client.request.headers.cookie
     */

    // Attach Whiteboard event listeners to incoming sockets
    _this.socketOnEventHandlers(socket);
  });

};

WhiteboardSocketHandler.socketOnEventHandlers = function(socket) {
  socket.broadcast.emit('sessionFound');

  // Needs a user UI feature, to let him/her create a username
  socket.on('joinedSession',function(uName, curSession){
    //push new user to session obj in db
    //emit update user list

    socket.broadcast.emit('userJoining', socket.id + ' has joined the session');
  });

  socket.on('validate', function(socket) {
    console.log('validation called');

    // Validate with database
  });

  socket.on('chatMsg', function(data) {
    console.log(data);
    socket.broadcast.emit('chatMsgSent', data);
  });

  socket.on('serverRequest', function(data) {
    console.log('server request made within namespace');
  });

  socket.on('disconnect',function() {
    console.log('user leaving');
    socket.broadcast.emit('userLeaving', socket.id);
  });
}

module.exports = WhiteboardSocketHandler;
