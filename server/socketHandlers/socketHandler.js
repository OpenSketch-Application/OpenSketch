var Session = require('../db/models/Session');
var User = require('../db/DbManagers/UserManager');
var wbLogic = require('./whiteboardSockets');
var EVENT = require('../../src/model/model').socketEvents;
//var validateCookie = require();

//var homeLogic = require('./homeSockets');
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
          canvasShapes: [],
          messages: []
        });

        newSession.save(function(err, obj) {
          if(err) {
            console.log(err);
          }
          else {
            console.log('Session saved to db');
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
      socket.on(EVENT.joinSession, wbLogic.joinSessionCB(socket, nspWb));
      socket.on(EVENT.chatMessage, wbLogic.chatMessageCB(socket, nspWb));
      socket.on('disconnect', wbLogic.disconnectCB(socket, nspWb));
      socket.on(EVENT.sendPencil, wbLogic.sendPencilCB(socket, nspWb));
      socket.on(EVENT.sendObject, wbLogic.sendObjectCB(socket,nspWb));
      socket.on(EVENT.saveObject, wbLogic.saveObjectCB(socket,nspWb));
    };
  }

  // Validation function
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);

    socket.on(EVENT.validateSession, function(sessionid) {
      console.log('in validate');

      console.log(socket.request.headers.cookie);

      //var userId = socket.request.headers.cookie.match(/userId:.*;/gi);

      Session.findById(sessionid, function(err, session) {
        var userFound = false;
        //session.users

        if(err || !session || !session.users || session.users.length >= session.sessionProperties.maxUsers) {
          socket.emit(EVENT.badSession);

          //console.log('full');
        }

        // session.users.forEach(function(user) {
        //   if(user._id === userId) {
        //     userFound = true;
        //   }
        // })

        //if(!userFound) socket.emit(EVENT.badSession);
      })

    });
  });
};
