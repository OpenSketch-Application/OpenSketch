var PIXI = require('pixi');
var model = require('../../../../model/model');
var Import = require('../shapes/Import');
var EVENT = require('../../../../model/model').socketEvents;
var request = require('superagent');


module.exports = function(el, AppState) {
  var fileSelect = document.getElementById('imgImport');
  var socket = AppState.Socket;
  var image;
  var location;

  function uploadImage(file) {
    var data = new FormData();
    data.append('sessionId', AppState.sessionId);
    data.append('userId', AppState.Users.currentUser._id);
    data.append('file', file);

    request.post(window.location.origin+'/api/upload')
           .send(data)
           .end(function(err, res){
              if(err) {
                console.log(err);
              } else {
                location = window.location.origin + '/' + JSON.parse(res.text).location;

                image = new Import(AppState.Tools.importer, location);
                image.graphics.x = image.graphics.y = 0;
                image = AppState.Canvas.Shapes.addNew(image);
                image.setMoveListeners(AppState);

                socket.emit(EVENT.shapeEvent, 'add', image.getProperties());
                socket.emit(EVENT.saveObject, image.getProperties());
                socket.emit(EVENT.shapeEvent, 'draw', image.getProperties());
                socket.emit(EVENT.shapeEvent, 'drawEnd', image.getProperties());

                fileSelect.value = null;
              }
           });
  }

  el.addEventListener('click', function(data) {
    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    selectPressed = true;
    AppState.Tools.selected = 'import';

    // // Fire event on the hidden file input field
    fileSelect.click();

    return false;
  });


  fileSelect.addEventListener('change', function(e) {
    uploadImage(this.files[0]);
  });
};



