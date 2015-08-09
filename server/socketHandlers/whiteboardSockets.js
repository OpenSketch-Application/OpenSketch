var Session = require('../db/models/Session');
var UserManager = require('../db/DbManagers/UserManager');
var ShapeManager = require('../db/DbManagers/CanvasShapesManager');
var EVENT = require('../../src/model/model').socketEvents;
var whiteboardSockets = {};

whiteboardSockets.deleteSessionCB = function(socket,nsp){
  return function(){
    var sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
    Session.remove({_id:sessionid},function(err){});
    socket.broadcast.emit(EVENT.deleteSession);
  };
};
whiteboardSockets.saveSessionCB = function(socket,nsp){
  return function(callback){
        var sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];

        Session.findById(sessionid, function(err, session){
          if(err){
            throw new Error('Error retrieving Session');
          }
          else if(session && session._id){
            var wrapper = {shapes: session.canvasShapes, messages: session.messages};
            callback(JSON.stringify(wrapper));
          }

        });
  };
};
whiteboardSockets.userListCB = function(socket,nsp){
  return function(sessionId){
        var sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];

        Session.findById(sessionid, function(err, session){
          if(err){
            throw new Error('Error retrieving Session');
          }
          else if(session && session._id){

           socket.emit(EVENT.UserList,session.users);
           }

        });

    };
};
//JOIN
whiteboardSockets.joinSessionCB = function(socket,nsp) {
  return function(uName, uID) {
        var sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        //validate name
        console.log('joinsession');

        //console.log(socket.request.headers.cookie);

        Session.findById(sessionid, function(err, session){
          if(err){
            console.warn('Error Retrieving Session: at ', new Date.toUTCString(), ' recieved sessionId: ', sessionid, ' retreieved ', session);
            //throw new Error('Error retrieving Session');
          }
          else if(session && session._id) {
            var currentUser = session.users.id(uID);
            console.log('CHECKING USER ', currentUser, socket.id);
            if(!uName) {
              console.log('ERROR: must have username');
              socket.emit(EVENT.badSession);
            }
            else if(currentUser && currentUser.username === uName) {
              socket.broadcast.emit(EVENT.announcement, currentUser.username + ' has rejoined the session');

              socket.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users, currentUser.userRank);


              socket.emit(EVENT.updateChatList, session.messages, session.canvasShapes);

              socket.emit(EVENT.populateCanvas, session.canvasShapes);

            }
            //push user to db
            else if(session.users.length < session.sessionProperties.maxUsers){
              var newUser = {
                username: uName,
                userRank: session.users.length,
                permissions: {
                  canDraw: session.sessionProperties.canDraw,
                  canChat: session.sessionProperties.canChat
                },
                _id: socket.id
              };

              session.users.push(newUser);

              session.save(function(err){
                if(err) {
                  console.log(err);
                }
                else {
                  console.log(session);
                  console.log(session.users[0].permissions);
                  socket.broadcast.emit(EVENT.announcement, uName + ' has joined the session');
                  socket.broadcast.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users);

                  socket.emit(EVENT.updateUserList, session.users.length+'/' + session.sessionProperties.maxUsers, session.users, session.users.length - 1);

                  socket.emit(EVENT.updateChatList, session.messages);

                  if(session.canvasShapes && session.canvasShapes.length > 0) {
                    for(var i = session.canvasShapes.length - 1; i >= 0; i--) {
                      session.canvasShapes[i].layerLevel = i;
                    }
                    // session.canvasShapes.sort(function(a,b) {
                    //   return a.layerLevel - b.layerLevel;
                    // });
                    socket.emit(EVENT.populateCanvas, session.canvasShapes);
                  }
                  //socket.broadcast.emit(EVENT.UserList, session.users);
                }
              });
            }
            else {
              // Need to emit socket event that too many users are present in session
              console.log('Too many users in this session ', session);
            }

          }
          else {
           console.warn('Null Sesson returned, Date: ', new Date.toUTCString(), ' recieved sessionId: ', sessionid, ' retreieved ', session);
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
          else if(session && session._id){
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
whiteboardSockets.disconnectCB = function(socket, nspWb){
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

         socket.broadcast.emit(EVENT.updateUserList, session.users.length+'/'+session.sessionProperties.maxUsers, session.users);

         socket.emit(EVENT.updateUserList, session.users.length+'/'+session.sessionProperties.maxUsers, session.users);

         // socket.emit(EVENT.userLeft, removedUser);
         // socket.broadcast.emit(EVENT.userLeft, removedUser.id);

         //socket.broadcast.emit(EVENT.UserList,session.users);

       }
       session.save(function(err){
           if(err) console.log(err);
           else {
            console.log(session);

            socket.disconnect();

           }
        });
      }
    });
  };
};

//DRAW
whiteboardSockets.sendPencilCB = function(socket,nspWb){
  return function(info){
    console.log('draw pencil received');
    //add drawing to db
    //emit drawing to other users
    socket.broadcast.emit(EVENT.sendPencil, info);
  };
};

whiteboardSockets.shapeObjectCB = function(socket, nspWb) {
  return function(eventType, data) {
    console.log('recieved socket shape event');
    console.log(eventType);
    console.log(data);

    socket.broadcast.emit(EVENT.shapeEvent, eventType, data);
  };
};

whiteboardSockets.saveObjectCB = function(socket, nspWb) {
  return function(data) {
    console.log('recieved socket save event');
    console.log(data);
    var sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];

    console.log('SAVING to sessionid', sessionid);
    // ShapeManager.findOne(sessionid, data._id, function(err,result){
    ShapeManager.addOne(sessionid, data, function(err, result){
      if(err) console.error('Unable to save Shape', new Date().getUTCDate(), 'Shape: ', data);
      else console.log('Shape added to DB');
    });

  };
}

whiteboardSockets.updateObjectCB = function(socket) {
  return function(data) {
    console.log('recieved socket update event');
    console.log(data);
    var sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];

    console.log('updating and saving to sessionid', sessionid);

    ShapeManager.updateOne(sessionid, data._id, data, function(err,result){
      if(err) console.error('Unable to update Shape', new Date().getUTCDate(), 'Shape: ', data);
      else console.log('Updated shape', data);
    });

  };
};

// whiteboardSockets.populateCanvasCB = function(socket) {
//   return function(shapes) {
//     console.log('recieved socket update event');
//     console.log(data);
//     var sessionid = socket.adapter.nsp.name.split('/');
//     sessionid = sessionid[sessionid.length - 1];

//     console.log('updating and saving to sessionid', sessionid);

//     ShapeManager.updateOne(sessionid, data._id, data, function(err,result){
//       if(err) console.error('Unable to update Shape', new Date().getUTCDate(), 'Shape: ', data);
//       else console.log('Updated shape', data);
//     });

//   };
// };

whiteboardSockets.permissionChangedCB = function(socket) {
  return function(userModel) {
    var sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];

    console.log('Saving User Permissions', userModel);

    UserManager.updateOne(sessionid, userModel._id, userModel, function(err, result) {
      if(err) console.log('Unable to update user\'s permissions', userModel);
      else console.log('User permission updated', userModel.username);
    });

    socket.broadcast.emit(EVENT.permissionChanged, userModel);
  };
};

whiteboardSockets.removeUser = function(socket) {
  return function(userModel) {
    var sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];

    console.log('Removing User', userModel);

    socket.broadcast.emit(EVENT.disconnectUser, {
      _id: userModel._id,
      sessionId: sessionid
    });

  }
};

whiteboardSockets.removeThisUser = function(socket) {
  return function(userModel) {
    var sessionid = socket.adapter.nsp.name.split('/');
    sessionid = sessionid[sessionid.length - 1];

    console.log('Removing User', userModel);
    socket.disconnect();
    UserManager.deleteOne(sessionid, userModel._id, function(err) {
      if(err) console.log('Unable to remove User from DB');
      else {
        socket.broadcast.emit(EVENT.announcement, userModel.username + ' has been removed from the session');
      }
    });
  };
};

whiteboardSockets.clearShapesCB = function(socket) {
  return function(data, onComplete) {
    var sessionid = socket.adapter.nsp.name.replace(/.*\//, '');
    var error;

    ShapeManager.deleteAll(sessionid, function(err, result) {
      if(err) {
        error = err;
        console.log(err, sessionid);
      }
      else {
        socket.broadcast.emit(EVENT.clearShapes);
        //console.log('Successfully cleared shapes');
      }
    });

    onComplete(error, 'Successfully cleared shapes');
  };
};

whiteboardSockets.removeShapeCB = function(socket) {
  return function(shapeId, onComplete) {
    var sessionid = socket.adapter.nsp.name.replace(/.*\//, '');
    var error;

    ShapeManager.deleteOne(sessionid, shapeId, function(err, result) {
      if(err) {
        error = err;
        console.log(err, sessionid);
      }
      else {
        socket.broadcast.emit(EVENT.removeShape, shapeId);
        //console.log('Successfully removed shapes');
      }
    });

    onComplete(error, 'Successfully removed shapes');
  };
};

whiteboardSockets.imageUploadCB = function(socket) {
  return function(location, onComplete) {
    var sessionid = socket.adapter.nsp.name.replace(/.*\//, '');
    console.log('RECEIVED')
    socket.broadcast.emit(EVENT.imageUpload, location);
  };
};


module.exports = whiteboardSockets;
