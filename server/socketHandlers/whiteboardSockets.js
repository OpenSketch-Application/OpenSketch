
var CanvasSession = require('../db/models/CanvasSession');
var EVENT = require('../../src/model/model').socketEvents;
var whiteboardSockets = {};
//JOIN
whiteboardSockets.joinSessionCB = function(socket,nsp){
  return function(uName,sessionid){
        //validate name
        console.log('joinsession');
        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
          if(err){

          }else if(obj){
            //push user to db
                 

            
            if(obj.users.length < obj.maxUsers){
              obj.users.push({
                name: uName,
                canDraw: obj.canDraw,
                canChat: obj.canChat,
                _id: socket.id
              }); 
              obj.save(function(err){
                 if(err) console.log(err);
                 else{
                   console.log(obj);
                   socket.broadcast.emit(EVENT.announcement, socket.id + ' has joined the session');
                   socket.broadcast.emit(EVENT.updateUserList, obj.users.length+'/'+obj.maxUsers, obj.users);
                   socket.emit(EVENT.updateUserList,obj.users.length+'/'+obj.maxUsers,obj.users);
                 }
              });
            }
          }
        });
  };          
  
};
//CHAT
whiteboardSockets.chatMessageCB = function(socket,nsp){
 return function(message){
        //socket emit chat to other users
        socket.broadcast.emit(EVENT.chatMessage, {
          'user': message.user,
          'msg': message.msg
        });
        console.log('msg received', message);
        //add chat to db //but maybe we don't need to keep chat messages stored?
      };

};
//DISCONNECT
whiteboardSockets.disconnectCB = function(socket,nspWb){
  return function(){
        sessionid = socket.adapter.nsp.name.split('/');
        sessionid = sessionid[sessionid.length - 1];
        console.log('disconn ',socket.id);
        //remove user from db
        CanvasSession.findOne({canvasId : sessionid},function(err,obj){
          if(err){

          }else if(obj){
            //delete user 
           if(obj.users){ 
             if(obj.users.id(socket.id)!=null){
               obj.users.id(socket.id).remove();
             }
           }

           console.log(obj.users.length,obj.maxUsers);
           socket.broadcast.emit(EVENT.announcement, socket.id + ' has left the session');
           socket.broadcast.emit(EVENT.updateUserList, obj.users.length+'/'+obj.maxUsers,obj.users);
           socket.emit(EVENT.updateUserList,obj.users.length+'/'+obj.maxUsers,obj.users);
       
           obj.save(function(err){
               if(err) console.log(err);
               else console.log(obj);
            });
          }
        });

  };
};
//DRAW
whiteboardSockets.sendDrawingCB = function(){
  return function(user, CanvasShape){
    //add drawing to db
    //emit drawing to other users
  };
};
module.exports = whiteboardSockets;
