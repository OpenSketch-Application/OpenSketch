var PIXI = require('pixi');
var EVENTS = require('../../../../model/model').socketEvents;

module.exports = function(AppState, el) {

  el.addEventListener('click', function(e) {
    //console.log('click fired');
    AppState.Tools.selected = 'select';
    activate();
  });

  var stage = AppState.Canvas.stage;
  var select = AppState.Tools.select;
  var socket = AppState.Socket;
  var mouseData;
  var selected = false;
  var moveObject = {
    x: 0,
    y: 0,
    _id: ''
  };

  var mousedown = function(data) {
    //data.originalEvent.preventDefault();

    selected = true;

    // Fire off selected ObjectId to server
    //socket.emit(EVENTS.);
  };

  var mousemove = function(data) {
    data.originalEvent.preventDefault();

    // Set selected
    if(select.selectedObject !== null) {
      var selectedObject = select.selectedObject;
      moveObject.x = data.global.x - selectedObject.origin.x;
      moveObject.y = data.global.y - selectedObject.origin.y;
      moveObject._id = selectedObject._id;

      selectedObject.move(moveObject);

      socket.emit(EVENTS.shapeObject, 'move', moveObject);
    }
  };

  var mouseup = function(data) {
    select.selectedObject = null;
  }

  // Return true for now, might decide to implement more complexity for
  // complex shapes
  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseup; // should also contain same methods as mouseup
  }

  return true;
}


