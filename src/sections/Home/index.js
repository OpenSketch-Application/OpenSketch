var fs = require('fs');

var f1 = require('f1');
var find = require('dom-select');
var framework = require('../../framework/index');
var model = require('../../model/model');
var states = require('./states');
module.exports = Section;
var SERVERNAME = window.location.origin;
var EVENT = model.socketEvents;
var Cookies = require('cookies-js');

function ValidateJSON(content){
  var rv = true;
  try{
    obj = JSON.parse(content);
    if(Object.prototype.toString.call(obj.shapes) != Object.prototype.toString.call([]))
      rv = false;

    if(Object.prototype.toString.call(obj.messages) != Object.prototype.toString.call([]))
      obj.messages = []

    var shapes = obj.shapes;
    var messages = obj.messages;
    for(var i =0 ; i < messages.length; i++){
      var skip = false;
      var msg = messages[i];
      if(msg.user == null || msg.user == undefined) skip = true;
      if(msg.msg == null || msg.msg == undefined) skip = true;

      if(skip == true)
        messages[i] = null;
    }
    for(var i =0 ; i < shapes.length;i++){
      var shp = shapes[i];
      var skip = false;
      if(shp._id  == null || shp._id == undefined)
         skip = true;

      if(shp.shapeType !='pencil'){
        if(shp.x == null || shp.x == undefined) skip = true;
        if(shp.y == null || shp.y == undefined) skip = true;
      }


      switch (shp.shapeType){
        case null:
        case undefined:
          skip = true;
        break;
        case 'pencil':
          if(shp.path == null || shp.path == undefined) skip = true;
        break;
        case 'line':
          if(shp.x2 == null || shp.x2 == undefined) skip = true;
          if(shp.y2 == null || shp.y2 == undefined) skip = true;
        break;
        case 'rectangle':
        case 'ellipse':
          if(shp.width == null || shp.width == undefined) skip = true;
          if(shp.height == null || shp.height == undefined)skip = true;
        break;
        case 'table':
          if(shp.cell == null || shp.cell == undefined)skip = true;
          if(shp.rows == null || shp.rows == undefined)skip = true;
          if(shp.cols == null || shp.cols == undefined)skip = true;
        break;
        case 'textbox':
          if(shp.textContent == null || shp.textContent == undefined) skip = true;
        break;
        default:
          skip = true;
        break;
      }
      if(skip == true){
        shapes[i] = null;
      }
    }
    var wrapper = {shapes:shapes,messages:messages};
    rv = wrapper;
  }catch(e){
    console.log('exception caught');
    rv = false
  }
  return rv;
}

function getWhiteboardSession(socket,whiteboardId,shapes){
  var max  = find('div.control input[name=maxUsers]').value;
  var maxUsers = parseInt(max);
  if(isNaN(maxUsers) || maxUsers > 30 || maxUsers <=0) {
    maxUsers = 30;
  }
  var name = find('.username').value;

  Cookies.set('username',name);

  var sessionSettings = {};
  sessionSettings.id = whiteboardId;
  sessionSettings.canDraw = find('div.control #roundedTwo').checked;
  sessionSettings.canChat = find('div.control #roundedOne').checked;
  sessionSettings.maxUsers = maxUsers;
  sessionSettings.shapes = shapes;

  sessionSettings.users = [];

  return sessionSettings;
}

function verifyForm(filecontent){
  console.log('in verify');
      var max  = find('div.control input[name=maxUsers]');
      var maxUsers = parseInt(max.value);
      var userName = find('div.control input.username');
      var importfile = find('#file-input');
      var error = { };
      error.errors = [];

      if(isNaN(maxUsers) || maxUsers > 30 || maxUsers <=0) {
        error.errors.push({msg:'Max users: 1 - 30',element: max});
      }
      if(userName.value == ''){
        error.errors.push({msg:'Please Enter a Username',element: userName});
      }

    var session = ValidateJSON(filecontent);
    if(session === false && filecontent != null)
      error.errors.push({msg:'Json File not valid',element: importfile});

    if(error.errors.length > 0){
      return {isErr: true, data: error};
    }
    else{
      if(filecontent === null) shapes = [];
      return {isErr: false, data: session};
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

    var username = find('#inputName');

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

    username.addEventListener('click', function(e) {
      this.className = "username";
    });
    //-----FILE LISTENERS
    var file = find('#file-input');
    file.addEventListener('click', function(e) {
      this.id = "file-input";
    });
    var filecontent = null;

    file.addEventListener('change',function(e){
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function(evt){
         if(evt.target.readyState == FileReader.DONE){
           filecontent = evt.target.result;
         }
      }
      reader.readAsText(file,'utf-8');

      },false);
    //-----
    find('#inputMax').addEventListener('click', function(e) {
      this.className = "";
    });

    // whiteboard options Section for user to create a whiteboard
    find('div.control:last-child button').addEventListener('click', function(e) {
      e.preventDefault();
      obj = verifyForm(filecontent);
      if(obj.isErr === true){
        var err = obj.data;

        var errLabel = find('label#errormsg');
        errLabel.innerHTML = '';
        for(var i = 0; i<err.errors.length;i++){
          el = err.errors[i].element;

          el.className = el.className + ' error';
          errLabel.innerHTML = errLabel.innerHTML + err.errors[i].msg + '<br/>';
        }

      }
      else {

        settings = getWhiteboardSession(socket,sid,err);
        settings.shapes = obj.data.shapes;
        settings.messages = obj.data.messages;
        socket.emit(EVENT.createSession,settings);

        if(settings.id){

          Cookies.set('created', settings.id);
          Cookies.set('UserId', settings.id);
          framework.go('/whiteboard/'+ settings.id);

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

