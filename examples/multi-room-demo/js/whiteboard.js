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

function addAnnouncement(msg){

  var li = document.createElement("LI"); 

  var msg = document.createTextNode(msg);

  var list =  document.getElementById('Announcements');

  li.appendChild(msg);
  list.appendChild(li);

}

  
