var fs = require('fs');
var io = require('io');
var f1 = require('f1');
var PIXI = require('pixi');
var find = require('dom-select');
var framework = require('../../framework/index');
var Model = require('../../model/model');
var states = require('./states');
var createTabs = require('./util/tabs');
var socketSetup = require('./util/sockets');
var Chatbox = require('./util/chatbox');

var UserManagement = require('./ui/usermanagement/userManagement');
var Toolbar = require('./util/toolbar');
var Cookies = require('cookies-js');
var EVENT = Model.socketEvents;
// A model object can all use it to store Application state properties
// Mostly information retrieved on-mass from Database
var AppState = require('../../model/AppState');

// For live Testing purposes
window.APP_STATE = AppState;
window.SHAPES = AppState.Canvas.Shapes;
window.TOOLS = AppState.Tools;
window.USERS = AppState.Users;
module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var socket = socketSetup(io, framework, AppState);

    var content = find('#content');

    this.section = document.createElement('div');
    this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.appendChild(this.section);

    createTabs();

    // Inits AppState with Pixi and adds Socket object to AppState objects
    AppState.init(PIXI, socket, find('#whiteboard-container'));


    this.toolbar = new Toolbar({
      whiteboard: '#whiteboard-container',
      tools: {
        select: '#tool-select',
        pencil: '#tool-pencil',
        eraser: '#tool-eraser',
        fill: '#tool-fill',
        shapes: '#tool-shapes',
        line: '#tool-shapes-line',
        ellipse: '#tool-shapes-ellipse',
        rectangle: '#tool-shapes-rectangle',
        text: '#tool-text',
        table: '#tool-table',
        import: '#tool-import',
        color: '#tool-color'
      }
    }, AppState);

    var saveWB = find('#save-whiteboard');
    var savePrompt = find('#save-whiteboard-prompt');
    var save = find('#save-whiteboard-prompt button');
    var input = find('#save-whiteboard-prompt input')

    this.sessionOptions = find('.options');
    this.sessionOptions.onclick = function(e) {
      e.stopPropagation();

      switch(e.target.id) {
        case 'opt-save':
          savePrompt.style.display = 'block';
          break;
        case 'opt-clear':
          socket.emit(EVENT.clearShapes, null, function(err) {
            if(err)
              console.log(err);
            else
              APP_STATE.clearShapes();
          });
          break;
        case 'opt-settings':

          break;
        case 'opt-close':
          socket.emit(EVENT.deleteSession);
          socket.disconnect();
          framework.go('/home');
          location.reload();
          break;
      }

    };


    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ whiteboard: find('#whiteboard')})
                           .parsers(require('f1-dom'))
                           .init('init');

    Chatbox.init(AppState);
    UserManagement.init(AppState);

   find('body').addEventListener('click',function(e){
      console.log(e);
      if(e.target.id != 'save-whiteboard' && e.target.parentElement.id != 'save-whiteboard-prompt')
        savePrompt.style.display = 'none';

   });

    save.addEventListener('click',function(e){
      e.preventDefault();
      socket.emit(EVENT.saveSession,function(data){
        var a  = window.document.createElement('a');  
        a.href = window.URL.createObjectURL(new Blob([data],{type: 'application/javascript'}));
        var filename = find('#save-whiteboard-prompt input').value;
        a.download = filename + '.js';
        savePrompt.style.display = 'none';
        a.click();
      });
      
    },false);


    setTimeout(function(){
      if(AppState.Socket.nsp != '/home')
        done();
      else{
       framework.go('/home');
      }
    },1000);

  },

  resize: function(w, h) {
    APP_STATE.Canvas.renderer.view.style.width =  (w < 964 ? 964 : w * 0.75) + 'px';
    APP_STATE.Canvas.renderer.view.style.height = h + 'px';
  },

  animateIn: function(req, done) {
      this.animate.go('idle', function() {
        done();
      }.bind(this));
  },

  animateOut: function(req, done) {
    this.animate.go('out', function() {
      done();
    }.bind(this));
  },

  destroy: function(req, done) {

    Cookies.expire('username');
    Cookies.expire('create');

    AppState.Socket.emit('disconnect');

    this.section.parentNode.removeChild(this.section);
    done();
  }
};
