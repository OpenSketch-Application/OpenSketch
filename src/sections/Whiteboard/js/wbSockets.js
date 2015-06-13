var find = require('dom-select');
var SERVERNAME = window.location.origin;

module.exports = function(io,framework){
var curSession = window.location.href;
    curSession = curSession.split('/');
    var end = curSession.length -1;
    var curSessionId = curSession[end];
    curSession = '/'+curSession[end - 1] +'/'+ curSession[end];

    var socket = io.connect(SERVERNAME);
    socket.emit('validate',curSessionId);
    socket.on('fullorinvalid',function(){
      framework.go('/home');
      done();
    });
    socket = io.connect(SERVERNAME +curSession);
    socket.emit('joinSession','testname',curSessionId);
    socket.on('userCount',function(msg){
       var Usertab =  find('.cd-tabs-content li[data-content=Users]');
       var countElement;
       countElement = document.getElementById('userCount');
       if(countElement){
        countElement.innerHTML = msg;
       }else{
        countElement = document.createElement('div');
        countElement.id = 'userCount';
        countElement.innerHTML = msg;
        Usertab.appendChild(countElement);
       }

    });
    socket.on('userJoining',function(msg,userCount){
      //update user list clientside
      //update chat tab with msg
       var Chattab =  find('.cd-tabs-content li[data-content=Chat]');

       console.log('User has been added to session');

       var div =document.createElement('div');
       div.innerHTML = msg;
       Chattab.appendChild(div);
      //adjust all users priority
      //send edited user list to db
    });
    socket.on('userLeaving',function(msg,userCount){
      //update user list clientside
      //update chat tab with msg
       var Chattab =  find('.cd-tabs-content li[data-content=Chat]');

       var div = document.createElement('div');
       div.innerHTML = msg;
       Chattab.appendChild(div);
      //adjust all users priority
      //send edited user list to db
    });


    console.log(curSession);
    return socket;

}
