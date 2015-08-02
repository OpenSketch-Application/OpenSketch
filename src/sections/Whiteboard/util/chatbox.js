var $ = require('jquery');
var EVENT = require('../../../model/model').socketEvents;
var Cookies = require('cookies-js');

module.exports = {
  init: function(AppState) {
    //var _this = this;

    this.socket = AppState.Socket;
    this.users = AppState.Users;

    this.chatMessages = $('.chatMessageBox div.chatMessages')[0];
    this.inputBox = $('.messageInputUI textarea')[0];
    this.sendButton = $('.messageInputUI button')[0];

    // Bind all necessary methods to this object
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);

    this.addUserInteraction();

    this.socketOnEventHandlers();

    return this;
  },

  removeUserInteraction: function() {
    this.sendButton.removeEventListener('click', this.onSubmitClick, false);

    this.inputBox.removeEventListener('keydown', this.onKeyDownHandler, false);
  },

  addUserInteraction: function() {
    this.sendButton.addEventListener('click', this.onSubmitClick, false);

    this.inputBox.addEventListener('keydown', this.onKeyDownHandler, false);
  },

  onSubmitClick: function(e) {
    e.preventDefault();

    if(this.inputBox.value.trim() != "")
      this.sendMessage();

    this.inputBox.value = "";
  },

  sendMessage: function() {
    var message = {
      user: Cookies.get('username'),
      msg: this.inputBox.value
    };

    // Send messages to other participants
    this.socket.emit('chatMessage', message);

    // Add message to current user's chatbox
    this.addMsg(message);
  },

  onKeyDownHandler: function(e) {
    if(e.keyCode == 13) {
      this.sendMessage();
      this.inputBox.value = "";
      return false;
    }
  },

  // Basic add message to chatbox
  addMsg: function(content) {
    var newMsg = $('<div id = "msgContainer">' +'<span style="font-weight: bold; font: 1em Arial;">'+ content.user + ':</span>&nbsp;&nbsp;' +
                    content.msg + '</div>');

    var newMsg = $('<div id = "msgContainer">' +'<div id="name">'+ content.user + ':</div><div id="msg">' +
                    content.msg + '</div><div style="clear: both;"></div></div>');

    this.chatMessages.appendChild(newMsg[0]);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },

  // announcement for user leaving and joining session
  addAnnouncement: function(msg){
    var ann = $('<div id="msgContainer"><div id="announcement">'+msg+'</div></div>');
    console.log(ann);
    this.chatMessages.appendChild(ann[0]);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },
  // All the events defined here happen after session has been validated and stored in the Db
  // Ensure we init Whiteboard after validating socket in whiteboard
  socketOnEventHandlers: function() {
    var _this = this;

    _this.socket.on(EVENT.chatMessage, function(data) {
      console.log('chat msg recieved', data);
      _this.addMsg(data);
    });

    _this.socket.on(EVENT.updateChatList, function(data, shapes) {
      for(var i = 0;i<data.length;i++){
        _this.addMsg(data[i]);
      }
    });

    // _this.socket.on(EVENT.populateCanvas, function(shapelist) {
    //   console.log('Update ShapeList', shapelist);
    // })

    _this.socket.on(EVENT.announcement, function(msg){
      _this.addAnnouncement(msg);
    });
  }
};


