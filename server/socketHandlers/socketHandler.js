var CanvasSession = require('../db/models/CanvasSession');

module.exports = function(io) {
  var home = io.of('/home');
  home.on('connection',homeHandler(home));

  function homeHandler(nspHome){
    return function(socket){
      console.log('emitting getid : '+socket.id);
      socket.emit('getId',socket.id);

      socket.on('createSession', function(canvasSession){
       //push canvasSession to db   
       
       //create new namespace
       var nsp = io.of('/whiteboard/'+canvasSession.id);
       nsp.on('connection',wbHandler(nsp));
       
      });
    };
  }
  function wbHandler(nspWb){
    return function(socket){
      socket.on('joinSession',function(uName,curSession){
        //push new user to session obj in db
        
        socket.broadcast.emit('userJoining', socket.id + ' has joined the session');
      });
      socket.on('disconnect',function(){
        socket.broadcast.emit('userLeaving', socket.id);
      });
    };
  }
  // Start socket and listen for incoming connections
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
   // socket.emit('news', { hello: 'world' });

   // socket.on('joinRoom', function (data) {
   //   console.log(data);
   // });
   // socket.on('test', function (data) {
   //   console.log(data);
   // });

  });
};
