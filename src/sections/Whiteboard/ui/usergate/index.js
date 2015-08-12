var fs = require('fs');
var f1 = require('f1');
var find = require('dom-select');
var framework = require('../../../../framework/index');
var Model = require('../../../../model/model');
var EVENT = Model.socketEvents;
var states = require('./states');
var Cookies = require('cookies-js');
var io = require('io');
var SERVERNAME = window.location.origin;
module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    this.createID = Cookies.get('created');

    var curSession = window.location.href;
    curSession = curSession.split('/');
    var end = curSession.length -1;
    var curSessionId = curSession[end];
    var userInfo =  Cookies.get(curSessionId);
    userInfo = userInfo && userInfo.split(',');
    var userId = userInfo && userInfo[0];
    var username = userInfo && userInfo[1];
    var userRank = userInfo && userInfo[2];

    curSession = '/'+curSession[end - 1] +'/'+ curSession[end];

    var socket = io.connect(SERVERNAME +curSession);
    // Wait four seconds before deciding to navigate User back to Home Page
    var timerCallback = setTimeout(function() {

      console.error('Unable to connect to session ', curSession, ' in 5 seconds');

      socket.disconnect();
      framework.go('/home');
      done();
      location.reload();
    }, 3000)

    socket.on('connect', function() {

      // Clear the previous timer
      if(timerCallback) clearTimeout(timerCallback);
      if(userInfo && userInfo.length === 1 && userInfo[0] === curSessionId) {
        alert('You have been kicked out of this session, please either join another or create a new one');
        socket.disconnect();
        framework.go('/home');
        done();
        location.reload();
      }
      // Need to store all user info in DB
      if(userId && username) {
        socket.emit(EVENT.joinSession, username, userId, this.createID === userId);
        done();
      }
      else {
        socket.emit(EVENT.UserList);
      }
    })

    socket.on(EVENT.UserList, function(users) {

      showUserGate(req, done, users);

      done();
    });

    var showUserGate = function(req, done, users) {
      var content = find('#content');
      this.section = document.createElement('div');
      this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
      content.appendChild(this.section);


      var btnJoin = find('#btnJoin');
      var input = find('.controls input');
      this.shader = find('#shader');
      var userList = find('#userList');
      var errorMsg = find('#errorMsg');
      states.init.promptbox.position[0] = -650/2;
      states.init.promptbox.position[1] = -document.body.offsetHeight*1.5;

      states.idle.promptbox.position[0] = -650/2;
      states.idle.promptbox.position[1] = window.outerHeight/2 - 550/1.65;

      states.out.promptbox.position[0] = -650/2;

      this.animate = new f1().states(states)
                             .transitions(require('./transitions'))
                             .targets({ shader: find('#shader'), promptbox: find('#promptbox')})
                             .parsers(require('f1-dom'))
                             .init('init');

      var usernames = [];

      userList.innerHTML = '';

      for( var i = 0; i < users.length;i++)
      {
       var li = document.createElement('li');

       li.appendChild(document.createTextNode(users[i].username));
       usernames[i] = users[i].username;
       userList.appendChild(li);
      }

      btnJoin.addEventListener('click', function(el){
        errorMsg.innerHTML = '';

        var Name = input.value;
        Name = Name && Name.trim();
        for(var i = 0; i < usernames.length;i++){
          if(Name == usernames[i]){
           errorMsg.innerHTML = 'The name '+Name+' is currently in use.';
           return;
          }
          if(Name.length >= 11){
           errorMsg.innerHTML = 'Username must not exceed 10 characters';
           return;
          }
          else if(Name.length === 0) {
           errorMsg.innerHTML = 'Username Cannot be blank';
           return;
          }
        }

        socket.emit(EVENT.joinSession, Name);

        this.animateOut();
        done();
      }.bind(this));

    }.bind(this);

  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    if(this.animate) {
      this.animate.go('idle', function() {
          done();
      }.bind(this));
    } else {
      done();
    }
  },

  animateOut: function(req, done) {
    if(this.animate) {
      this.animate.go('out', function() {
        this.shader.style.zIndex = -1
        if(done)
          done();
      }.bind(this));
    } else {
      done();
    }
  },

  destroy: function(req, done) {
    if(this.section)
      this.section.parentNode.removeChild(this.section);
    done();
  }
};
