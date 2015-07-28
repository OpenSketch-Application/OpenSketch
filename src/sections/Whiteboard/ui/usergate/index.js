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
    var userId = Cookies.get('UserId');
    var curSession = window.location.href;

    curSession = curSession.split('/');
    var end = curSession.length -1;
    var curSessionId = curSession[end];

    curSession = '/'+curSession[end - 1] +'/'+ curSession[end];

    var bannedSession = Cookies.get(curSessionId);
    var socket = io.connect(SERVERNAME +curSession);
    // Wait four seconds before deciding to navigate User back to Home Page
    var timerCallback = setTimeout(function() {
      console.error('Unable to connect to session ', curSession, ' in 5 seconds');
      socket.disconnect();
      framework.go('/home');
      done();
      location.reload();
    }, 5000)

    console.log(this.createID);

    socket.on('connect', function() {

      // Clear the previous timer
      if(timerCallback) clearTimeout(timerCallback);
      if(bannedSession && bannedSession === userId) {
        alert('You have been kicked out of this session, please either join another or create a new one');
        socket.disconnect();
        framework.go('/home');
        done();
        location.reload();
      }

      socket.emit(EVENT.UserList);

    })

    socket.on(EVENT.UserList, function(users) {
      //debugger;
      // Head User has been added to session for the first time
      if(users.length === 0) {
        socket.emit(EVENT.joinSession, Cookies.get('username'), Cookies.get('UserId'));
        done();
      }
      else {
        var matchedUser;

        users.some(function(user) {
          if(userId === user._id) {
            matchedUser = user;
            return true;
          }
          return false;
        });

        // If we found a match, show user the whiteboard, since he has already joined the session
        if(matchedUser && matchedUser._id === userId) {
          socket.emit(EVENT.joinSession, matchedUser.username, matchedUser._id);

        }
        //
        else {
          showUserGate(req, done, users);
        }
      }

      done();
    })

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

      //socket.on(EVENT.UserList,function(users){
      userList.innerHTML = '';
      for( var i = 0; i < users.length;i++)
      {
       var li = document.createElement('li');
       console.log(users[i]);
       li.appendChild(document.createTextNode(users[i].username));
       usernames[i] = users[i].username;
       userList.appendChild(li);
      }
      //});

      btnJoin.addEventListener('click', function(el){
        errorMsg.innerHTML = '';

        var Name = input.value;
        for(var i = 0; i < usernames.length;i++){
          if(Name == usernames[i]){
           errorMsg.innerHTML = 'The name '+Name+' is currently in use.';
           return;
          }
        }
        //return;
        Cookies.set('username', Name);

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
