var Session = require('../db/models/Session');
var User = require('../db/DbManagers/UserManager');
var wbLogic = require('./whiteboardSockets');
var EVENT = require('../../src/model/model').socketEvents;

module.exports = function(io,DB) {
  var home = io.of('/home');
  home.on('connection',homeHandler(home));

  function homeHandler(nspHome) {
    return function(socket) {
//      socket.on('createSession',createSessionCB(socket,nspHome));

      socket.emit(EVENT.getSocketID,socket.id);

      socket.on(EVENT.createSession, function(canvasSession) {
        //push canvasSession to db
        var newSession = new Session({
          _id: canvasSession.id,
          users: [],
          sessionProperties: {
            canDraw : canvasSession.canDraw,
            canChat : canvasSession.canChat,
            maxUsers : canvasSession.maxUsers
          },
          canvasShapes: canvasSession.shapes,
          messages: canvasSession.messages
        });

        newSession.save(function(err, obj) {
          if(err) {
          }
          else {
          }
        });

        //create new namespace
        var nsp = io.of('/whiteboard/' + canvasSession.id);
        nsp.on('connection', wbHandler(nsp));

      });
    };
  }
  function wbHandler(nspWb) {

    return function(socket) {

      socket.on(EVENT.deleteSession, wbLogic.deleteSessionCB(socket,nspWb));
      socket.on(EVENT.saveSession, wbLogic.saveSessionCB(socket,nspWb));
      socket.on(EVENT.joinSession, wbLogic.joinSessionCB(socket, nspWb));
      socket.on(EVENT.UserList, wbLogic.userListCB(socket,nspWb));
      socket.on(EVENT.chatMessage, wbLogic.chatMessageCB(socket, nspWb));
      socket.on('disconnect', wbLogic.disconnectCB(socket, nspWb));
      socket.on(EVENT.sendPencil, wbLogic.sendPencilCB(socket, nspWb));
      socket.on(EVENT.shapeEvent, wbLogic.shapeObjectCB(socket, nspWb));
      socket.on(EVENT.clearShapes, wbLogic.clearShapesCB(socket));
      socket.on(EVENT.removeShape, wbLogic.removeShapeCB(socket));
      socket.on(EVENT.imageUpload, wbLogic.imageUploadCB(socket));

      //socket.on(EVENT.populateCanvas, wbLogic.populateCanvasCB(socket));

      socket.on(EVENT.saveObject,wbLogic.saveObjectCB(socket,nspWb));
      socket.on(EVENT.updateObject, wbLogic.updateObjectCB(socket));

      // User Permissions
      socket.on(EVENT.permissionChanged, wbLogic.permissionChangedCB(socket));
      socket.on(EVENT.usersChanged, wbLogic.usersChangedCB(socket));
      socket.on(EVENT.removeUser, wbLogic.removeUser(socket));
      socket.on(EVENT.removeThisUser, wbLogic.removeThisUser(socket))
    };
  }

  // Validation function
  io.on('connection', function (socket) {

    socket.on(EVENT.validateSession, function(sessionid) {

      // var cookieString = socket.request.headers.cookie;
      // if(cookieString) {
      //   var userName = cookieString.match(/username=.*?(?=;)/gi);
      //   var userId = cookieString.match(/UserId=.*/gi);
      // }

      // userName = userName && userName[0].split('=')[1];
      // userId = userId && userId[0].split('=')[1];


      Session.findById(sessionid, function(err, session) {
        var userFound = false;
        // FOR TESTING AND DEVELOPMENT
        if(sessionid === 'session41') return;

        if(err || !session || !session.users || session.users.length >= session.sessionProperties.maxUsers) {
          socket.emit(EVENT.badSession);

        }
        // else if(userId) {
        //   var retreivedUser = session.users.id(userId);
        //   if(retreivedUser && retreivedUser.username === userName) {

        //   }
        // }

//'io=qF8EhX7TOCH9_DftAAAB; username=gordenRamsay; created=k857e8TSbSnH3-pKAAAE; UserId=k857e8TSbSnH3-pKAAAE'
        // session.users.forEach(function(user) {
        //   if(user._id === userId) {
        //     userFound = true;
        //   }
        // })

        //if(!userFound) socket.emit(EVENT.badSession);
      })
    });
  });

  io.on('disconnect', function(socket) {
  });
};
