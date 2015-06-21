var find = require('dom-select');
var io = require('io');
var EVENT = require('../../../model/model').socketEvents;
var SERVERNAME = window.location.origin;

module.exports = function(AppState, framework,done){
  var curSession = window.location.href;
  curSession = curSession.split('/');
  var end = curSession.length -1;
  var curSessionId = curSession[end];
  curSession = '/'+curSession[end - 1] +'/'+ curSession[end];

  var socket = io.connect(SERVERNAME);
  socket.on(EVENT.badSession,function(){
    framework.go('/home');
    done();
  });

  socket.emit(EVENT.validateSession,curSessionId);

  socket = io.connect(SERVERNAME +curSession);

  /*
    Wait for connection to be made
   */
  socket.on('connect', function(data) {
    console.log('connection made', data);

    // Validate using cookie call here
    // IE. either get existing cookie or set it
  })

  socket.on('reconnect', function(data) {
    console.log('reconnect called', data);
  });

  /**
   * Socket event handlers to register after connection
   * Might need to go into the on "connect" event, but so far
   * its working
   */
  socket.emit(EVENT.joinSession,'testname',curSessionId);

  socket.on(EVENT.updateUserList,function(msg,users,userId) {
    console.log('in update user list');
    var Usertab =  find('.cd-tabs-content li[data-content=Users]');
    var UsertabName = find('a[data-content=Users]');

    UsertabName.innerHTML = 'Users('+msg+')';

    var UserList = find('.userList');
    if(UserList){
      UserList.innerHTML = "";
    } else{
      UserList = document.createElement('div');
      UserList.className = 'userList';
    }
    for(var i = 0; i< users.length; i++){
      var user = document.createElement('div');
      user.innerHTML = 'Name: '+ users[i].username + '<br /> ID: '+users[i]._id;
      UserList.appendChild(user);
    }

    if(userId) {
      // Add Welcome message
      // Set user preferences
      console.log('Welcome! ', userId);
    }

    Usertab.appendChild(UserList);

  });

  // socket.on(EVENT.announcement,function(msg){
  //   //update user list clientside
  //   //update chat tab with msg
  //   var Chattab =  find('.chatMessageBox .chatMessages');
  //   console.log('user has Joined');
  //   var li = document.createElement('li');
  //   li.innerHTML = msg;
  //   Chattab.appendChild(li);
  //   //adjust all users priority
  //   //send edited user list to db
  // });

  console.log('Whiteboard socket', socket);

  console.log(curSession);
  return socket;

}
