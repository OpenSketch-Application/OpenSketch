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
       canvasSession.userCount = 0;
       testDB.push(canvasSession); 
       //create new namespace
       var nsp = io.of('/whiteboard/'+canvasSession.id);
       nsp.on('connection',wbHandler(nsp));
       
      });
    };
  }
  function wbHandler(nspWb){
    return function(socket){
      socket.on('joinSession',function(uName,sessionid){
        var userCount;
        var maxUsers;
        //validate name

        var incomingUser = {};
        
        //push new user to session obj in db
        for(var i = 0; i<testDB.length;i++){
          if(testDB[i].id == sessionid){
            var s = testDB[i];
            incomingUser.name = 'testName';
            incomingUser.id = socket.id;
            incomingUser.canChat = s.canChat;
            incomingUser.canDraw = s.canDraw;
            //incomingUser.priority = s.userCount +1;
            userCount = testDB[i].userCount+=1;
            testDB[i].users[userCount-1] = incomingUser;
            maxUsers = s.maxUsers;
            console.log(testDB[i].users);
          }
        }

        //emit update user list from db 
        //emit update whiteboard from db
        
        socket.broadcast.emit('userJoining', socket.id + ' has joined the session');
        socket.broadcast.emit('userCount', 'Users: '+userCount+'/'+maxUsers);
        socket.emit('userCount','Users: '+userCount+'/'+maxUsers);

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
        sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        console.log('disconn ',sessionid);
        //remove user from db
        var roll = false;
        var userCount;
        var maxUsers;
        for(var i = 0; i<testDB.length;i++){
          if(testDB[i].id == sessionid){
            for(var j = 0; j < testDB[i].userCount;j++){
              if(testDB[i].users[j]){
                if(testDB[i].users[j].id == socket.id){
                   roll = true;
                   userCount = testDB[i].userCount-=1;
                   maxUsers = testDB[i].maxUsers;
                }
              }
              if(roll){
                testDB[i].users[j] = testDB[i].users[j+1];
              }
            }
            console.log(testDB[i].users);
          }
        }
        socket.broadcast.emit('userLeaving', socket.id + ' has left the session');
        socket.broadcast.emit('userCount', 'Users: '+userCount+'/'+maxUsers);
        socket.emit('userCount','Users: '+userCount+'/'+maxUsers);

      });
    };
  }
  // Start socket and listen for incoming connections
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
    socket.on('validate',function(sessionid){
        var exists= false;
        var full = false;
        for(var i = 0; i<testDB.length;i++){
          console.log('in testdb: ',testDB[i].id,sessionid);
          if(testDB[i].id == sessionid){
              exists = true; 
              if(testDB[i].userCount >= testDB[i].maxUsers){
                full = true;
              }

          }
        }
        //if session is not in db or full redirect to home
        if(!exists || full){
          socket.emit('fullorinvalid');
        }

    });
  });
};
