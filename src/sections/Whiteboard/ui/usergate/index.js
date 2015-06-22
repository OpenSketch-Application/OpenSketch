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
      var content = find('#content');
      this.section = document.createElement('div');
      this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
      content.appendChild(this.section);

       
      var btnJoin = find('#btnJoin');
      var input = find('.controls input');
      this.shader = find('#shader');

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

      btnJoin.addEventListener('click', function(el){

        var Name = input.value;
        console.log(Name);
        Cookies.set('username',Name);
        var curSession = window.location.href;
        curSession = curSession.split('/');
        var end = curSession.length -1;
        var curSessionId = curSession[end];
        curSession = '/'+curSession[end - 1] +'/'+ curSession[end];


        var socket = io.connect(SERVERNAME +curSession);
        socket.emit(EVENT.joinSession,Cookies.get('username'),curSessionId);
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
