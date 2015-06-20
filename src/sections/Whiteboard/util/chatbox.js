var $ = require('jquery');
var EVENT = require('../../../model/model').socketEvents;
module.exports = {
  init: function(AppState) {
    var _this = this;
    _this.socket = AppState.Socket;
    _this.users = AppState.Users;

    _this.chatMessages = $('.chatMessageBox div.chatMessages')[0];
    _this.inputBox = $('.messageInputUI textarea')[0];
    _this.sendButton = $('.messageInputUI button')[0];

    _this.socketOnEventHandlers();

    _this.sendButton.addEventListener('click', function(e) {
      e.preventDefault();

      var message = {
        user: 'some user',
        msg: _this.inputBox.value
      }

      // Send messages to other participants
      _this.socket.emit('chatMessage', message);

      // Add message to current user's chatbox
      _this.addMsg(message);
    });
  },

  // Basic add message to chatbox
  addMsg: function(content) {
    var newMsg = $('<div id = "msgContainer">' +'<div id="name">'+ content.user + ':  ' +
                   '</div><div id="msg">'+ content.msg + '</div><div style="clear:both;"></div></div>');


    this.chatMessages.appendChild(newMsg[0]);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

  },
// announcement for user leaving and joining session
  addAnnouncement: function(msg){
    var ann = $('<div id="msgContainer"><div id="announcement">'+msg+'</div></div>');
    this.chatMessages.appendChild(ann[0]);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },
  // All the events defined here happen after session has been validated and stored in the Db
  // Ensure we init Whiteboard after validating socket in whiteboard
  socketOnEventHandlers: function() {
    var _this = this;

    _this.socket.on(EVENT.chatMessage, function(data) {
      _this.addMsg(data);
    });
    _this.socket.on(EVENT.updateChatList, function(data) {
      for(var i = 0;i<data.length;i++){
        _this.addMsg(data[i]);
      }
    });

    _this.socket.on(EVENT.announcement, function(msg){
      _this.addAnnouncement(msg);
    });
  }
};


