//var io = require('io');

  
 console.log('loaded');
      //var socket = io.connect('http://localhost');

var socket = io.connect('http://localhost:8080/lobby');
var userId = "";    
socket.on('getId', function(id){
  userId = id; 
});


    $('#createSession').submit(function(){
      console.log('onclick', socket);
      $('#createSession').attr('action','/session/' +userId); 
      var m, u, d, c;

      //m = document.getElementById('maxUsers');
      //u = document.getElementById('userName');
      //d = document.getElementById('drawPermission');
      //c = document.getElementById('chatPermission');

      var sessionSettings = {};

      sessionSettings.id= userId;
      sessionSettings.drawPermission = true;
      sessionSettings.chatPermission = false;
      sessionSettings.maxUsers = 30;
      sessionSettings.users = [];
      //var username = u;
     // sessionSettings.users.push(username);
      socket.emit('createSession',sessionSettings); 
      
    });


