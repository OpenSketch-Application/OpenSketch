module.exports = function(io,db) {
  var lobby = io.of('/lobby');
  lobby.on('connection',handleLobby(lobby));

// Standard handler for every session
  function handleConnection(namespace){
     return function(socket){
       console.log('connected ',socket.adapter.nsp.name);

       socket.on('joinSession',function(uName,curSession){
         var currentUsers;
         for(var i = 0; i<db.length; i++){
           if(db[i].id == curSession){
             db[i].users.push({id: socket.id, name : uName});
             currentUsers = db[i].users; 
           }
         }
         
         socket.emit('updateUserList',currentUsers);
         socket.broadcast.emit('updateUserList',currentUsers);

         socket.broadcast.emit('userJoining', socket.id + ' has joined the session'); 
       });
       
       socket.on('disconnect',function(){
         socket.broadcast.emit('userLeaving', socket.id + ' has left');  
       });
       
     };
  }

//Special handler for Before you create/join a room 
  function handleLobby(lobby){
    return function(socket){
      console.log('lets all go to the lobby');
      socket.emit('getId',socket.id);

      socket.on('createSession',function(sessionSettings){
         console.log('creating session'); 

         db.push(sessionSettings);
          
         // creates new namespace with standard handler
         var nsp = io.of('/session/'+sessionSettings.id);
         console.log(sessionSettings);
         nsp.on('connection',handleConnection(nsp));
      });
    };
  };

};
