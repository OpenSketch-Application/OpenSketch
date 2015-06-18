var Session = require('../db/models/Session');
var EVENT = require('../../src/model/model').socketEvents;
var whiteboardSockets = {};

//JOIN
whiteboardSockets.joinSessionCB = function(socket,nsp) {
  return function(uName,sessionid) {
        //validate name
        console.log('joinsession');

        Session.findById(sessionid, function(err, session){
          if(err){
            throw new Error('Error retrieving Session');
          }
          else if(session._id){
            //push user to db

            if(session.users.length < session.sessionProperties.maxUsers){
              session.users.push({
                username: uName,
                userRank: session.users.length,
                canDraw: session.canDraw,
                canChat: session.canChat,
                _id: socket.id
              });

              session.save(function(err){
                 if(err) console.log(err);
                 else{
                   console.log(session);
                   socket.broadcast.emit(EVENT.announcement, socket.id + ' has joined the session');
                   socket.broadcast.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users);
                   socket.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users);
                 }
              });
            }
          }
        });
  };

};
//CHAT
whiteboardSockets.chatMessageCB = function(socket,nsp){
 return function(message) {
        //socket emit chat to other users
        socket.broadcast.emit(EVENT.chatMessage, {
          'user': message.user,
          'msg': message.msg
        });
        console.log('msg received', message);
        //add chat to db //but maybe we don't need to keep chat messages stored?

      };

};
//DISCONNECT
whiteboardSockets.disconnectCB = function(socket,nspWb){
  return function() {
    sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];
    console.log('disconn ',socket.id);
    //remove user from db
    Session.findOne({canvasId : sessionid}, function(err,obj){
      if(err){

      } else if(obj) {
        //delete user
       if(obj.users){
         if(obj.users.id(socket.id)!=null){
           obj.users.id(socket.id).remove();
         }
       }

       console.log(obj.users.length,obj.maxUsers);
       socket.broadcast.emit(EVENT.announcement, socket.id + ' has left the session');
       socket.broadcast.emit(EVENT.updateUserList, obj.users.length+'/'+obj.maxUsers,obj.users);
       socket.emit(EVENT.updateUserList,obj.users.length+'/'+obj.maxUsers,obj.users);

       obj.save(function(err){
           if(err) console.log(err);
           else console.log(obj);
        });
      }
    });
  };
};

//DRAW
whiteboardSockets.sendDrawingCB = function(){
  return function(user, CanvasShape){
    //add drawing to db
    //emit drawing to other users
  };
};

module.exports = whiteboardSockets;
