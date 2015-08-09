var fs = require('fs');
var io = require('io');
var f1 = require('f1');
var PIXI = require('pixi');
var framework = require('../../framework/index');
var Model = require('../../model/model');
var states = require('./states');
var createTabs = require('./util/tabs');
var socketSetup = require('./util/sockets');
var Chatbox = require('./util/chatbox');
var ShapeAttributeEditor = require('./ui/shapeEditor');
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
    var content = document.body.querySelector('#content');

    this.section = document.createElement('div');
    this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.appendChild(this.section);

    createTabs();

    // Inits AppState with Pixi and adds Socket object to AppState objects
    AppState.init(PIXI, socket, this.section.querySelector('#whiteboard-container'));

    ShapeAttributeEditor.init(AppState);

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

    var saveWB = this.section.querySelector('#save-whiteboard');
    var savePrompt = this.section.querySelector('#save-whiteboard-prompt');
    var save = this.section.querySelector('#save-whiteboard-prompt button');
    var input = this.section.querySelector('#save-whiteboard-prompt input')

    this.sessionOptions = this.section.querySelector('.options');
    this.sessionOptions.onclick = function(e) {
      e.stopPropagation();

      switch(e.target.id) {
        case 'opt-save':
          savePrompt.className = 'saveDialogOpen';//.style.display = 'block';
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
                           .targets({ whiteboard: this.section.querySelector('#whiteboard')})
                           .parsers(require('f1-dom'))
                           .init('init');


    this.toolbar.addUserInteraction();

    AppState.ToolBar = this.toolbar;
    Chatbox.init(AppState);
    UserManagement.init(AppState);

   document.body.addEventListener('click',function(e){
      if(e.target.id != 'save-whiteboard' && e.target.parentElement.id != 'save-whiteboard-prompt')
        savePrompt.className = '';
   });

    save.addEventListener('click',function(e){
      e.preventDefault();
      socket.emit(EVENT.saveSession,function(data){
        var a  = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([data],{type: 'application/javascript'}));
        var filename = this.section.querySelector('#save-whiteboard-prompt input').value;
        a.download = filename + '.js';
        savePrompt.className = '';
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
