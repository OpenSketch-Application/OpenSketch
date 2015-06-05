var CanvasSession = require('../db/models/CanvasSession');

module.exports = function(io,testDB) {
  var home = io.of('/home');
  home.on('connection',homeHandler(home));

  function homeHandler(nspHome){
    return function(socket){
      console.log('emitting getid : '+socket.id);
      socket.emit('getId',socket.id);

      socket.on('createSession', function(canvasSession){
       //push canvasSession to db   
       testDB.push(canvasSession); 
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
              //emit update user list from db 
              //emit update whiteboard from db
        
        socket.broadcast.emit('userJoining', socket.id + ' has joined the session');
      });
      socket.on('chatMessage',function(user, msg){
        //socket emit chat to other users  
        //add chat to db //but maybe we don't need to keep chat messages stored?
      });
      socket.on('sendDrawing',function(user, CanvasShape){
        //add drawing to db 
        //emit drawing to other users
      });

      socket.on('disconnect',function(){
        socket.broadcast.emit('userLeaving', socket.id);
      });
    };
  }
  // Start socket and listen for incoming connections
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
    socket.on('validate',function(sessionid){
        var exists= false;
        for(var i = 0; i<testDB.length;i++){
          console.log('in testdb: ',testDB[i].id,sessionid);
          if(testDB[i].id == sessionid){
              exists = true; 
          }
        }
        //if session is not in db redirect to home
        if(!exists){
          socket.emit('notFound');
        }

    });
  });
};
