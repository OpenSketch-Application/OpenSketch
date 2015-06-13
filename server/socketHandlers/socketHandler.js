var CanvasSession = require('../db/models/CanvasSession');

module.exports = function(io,DB) {
  var home = io.of('/home');
  home.on('connection',homeHandler(home));

  function homeHandler(nspHome){
    return function(socket){
      console.log('emitting getid : '+socket.id);
      socket.emit('getId',socket.id);

      socket.on('createSession', function(canvasSession){
       //push canvasSession to db
       canvasSession.userCount = 0;
       var newSession = new CanvasSession(
       {
         canvasId : canvasSession.id,
         canDraw : canvasSession.canDraw,
         canChat : canvasSession.canChat,
         maxUsers : canvasSession.maxUsers
       }
       ); 

       newSession.save(function(err,obj){
         if(err){
           console.log(err);
         }
         else{
           console.log('success',obj);
         }
       });
       //create new namespace
       var nsp = io.of('/whiteboard/'+canvasSession.id);
       nsp.on('connection',wbHandler(nsp));

      });
    };
  }
  function wbHandler(nspWb){
    return function(socket){
      socket.on('joinSession',function(uName,sessionid){
        //validate name
        
       //push user to db 
        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
          if(err){

          }else if(obj){
            //push user to canvas
            obj.users.push({
              name: uName,
              canDraw: true,
              canChat: true,
              _id: socket.id
            });      

            socket.broadcast.emit('userJoining', socket.id + ' has joined the session');
            socket.broadcast.emit('userCount', 'Users: '+obj.users.length+'/'+obj.maxUsers);
            socket.emit('userCount','Users: '+obj.users.length+'/'+obj.maxUsers);

            obj.save(function(err){
               if(err) console.log(err);
               else console.log(obj);
            });


          }
        });      

        
        //console.log('User joining', uName, 'sessionId', sessionid);

        //emit update user list from db
        //emit update whiteboard from db


      });
      socket.on('chatMessage',function(message){
        //socket emit chat to other users
        socket.broadcast.emit('chatMessage', {
          'user': message.user,
          'msg': message.msg
        });
        console.log('msg received', message);
        //add chat to db //but maybe we don't need to keep chat messages stored?
      });
      socket.on('sendDrawing',function(user, CanvasShape){
        //add drawing to db
        //emit drawing to other users
      });

      socket.on('disconnect',function(){
        sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        console.log('disconn ',socket.id);
        //remove user from db

        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
          if(err){

          }else if(obj){
            //delete user 
           if(obj.users.id(socket.id)!=null){
             obj.users.id(socket.id).remove();
           }

           console.log(obj.users.length,obj.maxUsers);
           socket.broadcast.emit('userLeaving', socket.id + ' has left the session');
           socket.broadcast.emit('userCount', 'Users: '+obj.users.length+'/'+obj.maxUsers);
           socket.emit('userCount','Users: '+obj.users.length+'/'+obj.maxUsers);

           obj.save(function(err){
               if(err) console.log(err);
               else console.log(obj);
            });
        });
        

      });
    };
  }
  // Start socket and listen for incoming connections
  io.on('connection', function (socket) {

    console.log('connection made', socket.id);
    socket.on('validate',function(sessionid){
        console.log('in validate');
        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
           if(err){
             console.log(err);
             socket.emit('fullorinvalid');
           }else if(obj){
             console.log('found');    
             if(obj.users.length >= obj.maxUsers){
               socket.emit('fullorinvalid');
               console.log('full');
             }
           }else{
             socket.emit('fullorinvalid');
           }

        });


    });
  });
};
