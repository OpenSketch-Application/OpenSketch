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

    console.log(this.createID);
    if(this.createID != window.location.href.replace(/.*\//, '')) {

      // We will need to check if User is not already kicked out of this session
      if(Cookies.get('username') != null) {
        done();
      }

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
      var curSession = window.location.href;
      curSession = curSession.split('/');
      var end = curSession.length -1;
      var curSessionId = curSession[end];
      curSession = '/'+curSession[end - 1] +'/'+ curSession[end];


      var socket = io.connect(SERVERNAME +curSession);
      var usernames = [];

      socket.emit(EVENT.UserList);

      socket.on(EVENT.UserList,function(users){
           userList.innerHTML = '';
           for( var i = 0; i < users.length;i++)
           {
             var li = document.createElement('li');
             console.log(users[i]);
             li.appendChild(document.createTextNode(users[i].username));
             usernames[i] = users[i].username;
             userList.appendChild(li);
           }
      });

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
        socket.emit(EVENT.joinSession, Name, curSessionId);
        this.animateOut();
      }.bind(this));
    }

    done();
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
