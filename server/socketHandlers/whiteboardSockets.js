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
                   socket.broadcast.emit(EVENT.announcement, uName + ' has joined the session');
                   socket.broadcast.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users);

                   socket.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users);

                   socket.emit(EVENT.updateChatList, session.messages);
                   socket.emit(EVENT.updateCanvas, session.canvasShapes);
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
        var sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];

        Session.findById(sessionid, function(err, session){
          if(err){
            throw new Error('Error retrieving Session');
          }
          else if(session._id){
            //push user to db

            if(session.users.length < session.sessionProperties.maxUsers){
              session.messages.push({
                userID : socket.id,
                user: message.user,
                msg: message.msg
              });
              session.save(function(err){
                 if(err) console.log(err);
                 else{
                   console.log('saved msg');

                 }
              });
           }
          }
        });
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
    Session.findById(sessionid, function(err,session){
      if(err){
        console.log('error');
      } else if(session) {
        //delete user
       var removedUser;
       if(session.users){
         if(session.users.id(socket.id)!=null){
           removedUser = session.users.id(socket.id);
           session.users.id(socket.id).remove();
         }
       }
       if(removedUser != undefined){
         socket.broadcast.emit(EVENT.announcement, removedUser.username + ' has left the session');
         socket.broadcast.emit(EVENT.updateUserList, session.users.length+'/'+session.sessionProperties.maxUsers,session.users);
         socket.emit(EVENT.updateUserList,session.users.length+'/'+session.sessionProperties.maxUsers,session.users);
       }
       session.save(function(err){
           if(err) console.log(err);
           else console.log(session);
        });
      }
    });
  };
};

//DRAW
whiteboardSockets.sendPencilCB = function(socket,nspWb){
  return function(condition,info){
    //add drawing to db
    //emit drawing to other users
    switch(condition){
      case 'mousemove':
        socket.broadcast.emit(EVENT.sendPencil,info);
        console.log('mousemove');
        break;
      case 'mouseup':
        console.log('mouseup');
        sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        Session.findById(sessionid, function(err,session){
          if(err){
            console.log('error(sendPenciltoDb)');
          }else if(session){
            session.canvasShapes.push(info);
            session.save(function(err){
              if(err) console.log('error saving (sendpenciltodb)'); 
            });
          }
        });
        break;
    }

  };
};

whiteboardSockets.sendObjectCB = function(socket,nspWb){
  return function(info){
    socket.broadcast.emit(EVENT.sendObject,info);
  }
};
whiteboardSockets.saveObjectCB = function(socket,nspWb){
  return function(info){
        sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        Session.findById(sessionid, function(err,session){
          if(err){
            console.log('error');
          }else if(session){
            session.canvasShapes.push(info);
            session.save(function(err){
              if(err) console.log('error saving object'); 
            });
          }
        });
  }
};

module.exports = whiteboardSockets;
