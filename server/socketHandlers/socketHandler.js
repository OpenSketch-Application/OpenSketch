var CanvasSession = require('../db/models/CanvasSession');
var wbLogic = require('./whiteboardSockets');
var EVENT = require('../../src/model/model').socketEvents;
//var homeLogic = require('./homeSockets'); 
module.exports = function(io,DB) {
  var home = io.of('/home');
  home.on('connection',homeHandler(home));

  function homeHandler(nspHome){
    return function(socket){
//      socket.on('createSession',createSessionCB(socket,nspHome));

      socket.emit(EVENT.getSocketID,socket.id);

      socket.on(EVENT.createSession, function(canvasSession){
       //push canvasSession to db
       var newSession = new CanvasSession(
       {
         canvasId : canvasSession.id,
         canDraw : canvasSession.canDraw,
         canChat : canvasSession.canChat,
         maxUsers : canvasSession.maxUsers
       }
       ); 

       newSession.save(function(err,obj){
         if(err){
           console.log(err);
         }
         else{
           console.log('Session saved to db');
         }
       });
       //create new namespace
       var nsp = io.of('/whiteboard/'+canvasSession.id);
       nsp.on('connection',wbHandler(nsp));

      });
    };
  }
  function wbHandler(nspWb){
    return function(socket){
      socket.on(EVENT.joinSession,wbLogic.joinSessionCB(socket,nspWb));
      socket.on(EVENT.chatMessage,wbLogic.chatMessageCB(socket,nspWb));
      socket.on('disconnect',wbLogic.disconnectCB(socket,nspWb));
      socket.on(EVENT.sendDrawing,wbLogic.sendDrawingCB(socket,nspWb));

    };
  }
  
  // Validation function
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
    socket.on(EVENT.validateSession,function(sessionid){
        console.log('in validate');
        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
           if(err){
             console.log(err);
             socket.emit(EVENT.badSession);
           }else if(obj){
             console.log('found, len: ',obj.users.length);    
             if(obj.users.length >= obj.maxUsers){
               socket.emit(EVENT.badSession);
               console.log('full');
             }
           }else{
             socket.emit(EVENT.badSession);
           }

        });


    });
  });
};
