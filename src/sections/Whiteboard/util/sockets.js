var find = require('dom-select');
var EVENT = require('../../../model/model').socketEvents;
var SERVERNAME = window.location.origin;
var Cookies = require('cookies-js');

module.exports = function(io, framework, AppState){
  var curSession = window.location.href;
  curSession = curSession.split('/');
  var end = curSession.length -1;
  var curSessionId = curSession[end];
  curSession = '/'+curSession[end - 1] +'/'+ curSession[end];

  var socket = io.connect(SERVERNAME);

  socket.on(EVENT.badSession,function(){
    socket.nsp = '/home';
  });

  socket.emit(EVENT.validateSession, curSessionId);

  socket = io.connect(SERVERNAME + curSession);

  socket.on('connect', function(info) {
    AppState.sessionId = curSessionId;
  });

  // if(Cookies.get('UserId') === curSessionId) {
  //   socket.emit(EVENT.joinSession);
  // }

  //socket.emit(EVENT.joinSession);
  //};

  socket.on(EVENT.announcement,function(msg){
    //update user list clientside
    //update chat tab with msg
    var Chattab = find('.chatMessageBox .chatMessages');

    var li = document.createElement('li');
    li.innerHTML = msg;
    Chattab.appendChild(li);
    //adjust all users priority
    //send edited user list to db
  });

  socket.on(EVENT.deleteSession,function(){
       socket.disconnect();
       framework.go('/home');
       location.reload();
  });

  socket.on(EVENT.clearShapes, function(){
    console.log('clearing shapes')
    APP_STATE.clearShapes();
  });

  socket.on(EVENT.removeShape, function(shapeId) {
    AppState.Canvas.Shapes.removeShapeByID(shapeId);
  });

  return socket;
}
