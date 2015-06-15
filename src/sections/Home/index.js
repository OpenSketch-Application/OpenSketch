var fs = require('fs');
var f1 = require('f1');
var find = require('dom-select');
var framework = require('../../framework/index');
var model = require('../../model/model');
var states = require('./states');
module.exports = Section;
var SERVERNAME = window.location.origin;
var EVENT = model.socketEvents;

function getWhiteboardSession(socket,whiteboardId){
      var max  = find('div.control input[name=maxUsers]').value;
      var maxUsers = parseInt(max);
      if(isNaN(maxUsers) || maxUsers > 30 || maxUsers <=0) {
        maxUsers = 30;
      }

      var sessionSettings = {};
      sessionSettings.id = whiteboardId;
      sessionSettings.canDraw = find('div.control #roundedTwo').checked;
      sessionSettings.canChat = find('div.control #roundedOne').checked;
      sessionSettings.maxUsers = maxUsers;

      sessionSettings.users = [];
      socket.emit(EVENT.createSession,sessionSettings);
      console.log(sessionSettings);
      return sessionSettings.id;
}
function verifyForm(){
  console.log('in verify');
      var max  = find('div.control input[name=maxUsers]');
      var maxUsers = parseInt(max.value);
      var userName = find('div.control input.username');
      var error = { };
      error.errors = [];

      if(isNaN(maxUsers) || maxUsers > 30 || maxUsers <=0) {
         error.errors.push({msg:'Max users: 1 - 30',element: max});
      }
      if(userName.value == ''){
         error.errors.push({msg:'Please Enter a Username',element: userName});
      }
      
     console.log('error');
     if(error.errors.length > 0){
       return error;
     }
     else{
       return null;
     }
      
}

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var socket = io.connect(SERVERNAME +'/home');
    var sid;
    socket.on(EVENT.getSocketID,function(id){
        sid= id;
    });

    var content = find('#content');
    this.section = document.createElement('div');
    this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.appendChild(this.section);

    states.out.home.position[1] = -document.body.offsetHeight;

    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ textbox1: find('#textbox1'),
                                      textbox2: find('#textbox2'),
                                      textbox3: find('#textbox3'),
                                      home: find('#home')
                                    })
                           .parsers(require('f1-dom'))
                           .init('init');

    find('#inputName').addEventListener('click', function(e) {
      this.className = "username";
    });

    find('#inputMax').addEventListener('click', function(e) {
      this.className = "";
    });

    // whiteboard options Section for user to create a whiteboard
    find('div.control:last-child button').addEventListener('click', function(e) {
      e.preventDefault();
      err = verifyForm();
      if(err !=null || err!= undefined){
        var errLabel = find('label#errormsg');
        errLabel.innerHTML = '';
        for(var i = 0; i<err.errors.length;i++){
          el = err.errors[i].element;  
          
          el.className = el.className + ' error';
          errLabel.innerHTML = errLabel.innerHTML + err.errors[i].msg + '<br/>'; 
        }
      }else{

        WhiteboardId = getWhiteboardSession(socket,sid);

        if(WhiteboardId != undefined && WhiteboardId !=null){
          framework.go('/whiteboard/'+ WhiteboardId);
        }else{
          socket = io.connect(SERVERNAME+'/home');
        }
      }
    }.bind(this));

    done();
  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    this.animate.go('idle', function() {
      if(done)
        done();
    }.bind(this));
  },

  animateOut: function(req, done) {
    this.animate.go('out', function() {
      if(done)
        done();
    }.bind(this));
  },

  destroy: function(req, done) {
    this.section.parentNode.removeChild(this.section);
    done();
  }
};


function getWhiteboardSettings() {
  var inputElements = document.querySelectorAll('form input');
  var form = document.querySelector('div.form form');
  var formData = new FormData(form);
  var ajax = new XMLHttpRequest();
  ajax.setRequestHeader("Content-Type", "JSON");
  ajax.send(formData);
}
