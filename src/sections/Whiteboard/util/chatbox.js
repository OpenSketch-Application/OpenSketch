var $ = require('jquery');

module.exports = {
  init: function(req, socket, done) {
    var _this = this;
    _this.socket = socket;
    _this.chatMessages = $('.chatMessageBox ul.chatMessages')[0];
    _this.inputBox = $('.messageInputUI input')[0];
    _this.sendButton = $('.messageInputUI button')[0];

    _this.socketOnEventHandlers();

    _this.sendButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('input text', _this.inputBox.value);
      console.log(_this.socket);
      var message = {
        user: 'some user',
        msg: _this.inputBox.value
      }

      _this.socket.emit('chatMessage', message);

      _this.addMsg(message);
    });
  },

  // Basic add message to chatbox
  addMsg: function(content) {
    console.log(content.user + 'msg about to be added', content.msg);
    var newMsg = $('<li>' + content.user + ':  ' + content.msg + '</li>');
    console.log(this.chatMessages);
    console.log(newMsg);
    this.chatMessages.appendChild(newMsg[0]);
  },

  // All the events defined here happen after session has been validated and stored in the Db
  // Ensure we init Whiteboard after validating socket in whiteboard
  socketOnEventHandlers: function() {
    var _this = this;
    console.log('attached socket', _this.socket);
    console.log('Chat box socket handlers set');

    _this.socket.on('chatMessage', function(data) {
      console.log('chat msg recieved', data);
      _this.addMsg(data);
    });
  }
};

