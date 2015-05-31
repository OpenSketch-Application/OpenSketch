//var io = require('io');

  
console.log('loaded');
      //var socket = io.connect('http://localhost');

var userName = prompt("Enter your name.");    

var socket = io.connect(window.location.href);

var sessionid = window.location.href;
sessionid = sessionid.split('/');
sessionid = sessionid[sessionid.length - 1];
console.log(sessionid);
socket.emit('joinSession',userName,sessionid);


socket.on('userJoining',function(msg){
  addAnnouncement(msg);
});

socket.on('userLeaving',function(msg){
  addAnnouncement(msg);
});
socket.on('updateUserList',function(users){
 alert('blah');  
 var userlist = document.getElementById('user-list');
 while(userlist.firstChild){
   userlist.removeChild(userlist.firstChild);
 }

 for(var i = 0; i < users.length;i++){
   var li = document.createElement('LI');
   var cur = document.createTextNode('id: ' + users[i].id + ' Name: '+ users[i].name);  
   li.appendChild(cur); 
   userlist.appendChild(li);
 }
});

function addAnnouncement(msg){

  var li = document.createElement('LI'); 

  var msg = document.createTextNode(msg);

  var list =  document.getElementById('Announcements');

  li.appendChild(msg);
  list.appendChild(li);

}

  
