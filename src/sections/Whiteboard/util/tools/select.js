var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

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
  var isDown = false;
  var moveObject = {
    x: 0,
    y: 0,
    _id: ''
  };
  var saveObject = {
    x: 0,
    y: 0,
    _id: ''
  };
  var mousedown = function(data) {
    //data.originalEvent.preventDefault();

    isDown = true;
    if(select.selectedObject !== null) {
      if(select.clickedObject) {
        console.log('clicked on object');
      }
      else {
        console.log('clicked on stage');
      }

      select.clickedObject = false;

      // Fire off selected ObjectId to server
      //socket.emit(EVENTS.);
    }
  };

  var mousemove = function(data) {
    data.originalEvent.preventDefault();

    // Set selected
    if(isDown && select.selectedObject !== null) {
      var selectedObject = select.selectedObject;
      moveObject.x = data.global.x - selectedObject.origin.x;
      moveObject.y = data.global.y - selectedObject.origin.y;
      moveObject._id = selectedObject._id;


      selectedObject.move(moveObject);


      socket.emit(EVENT.shapeObject, 'move', moveObject);

    }
  };

  var mouseup = function(data) {
    if(select.selectedObject) {
      var shapeId = select.selectedObject._id;
      // Emit socket interactionEnd Event, since drawing has ended on mouse up
      socket.emit(EVENT.shapeObject, 'interactionEnd', shapeId);
      //saveObject.xM = select.selectedObject.x + moveObject.x;
      //saveObject.yM = select.selectedObject.y +moveObject.y;
      saveObject.moveX = moveObject.x;
      saveObject.moveY = moveObject.y;
      saveObject._id = moveObject._id;
      saveObject.x = select.selectedObject.x;
      saveObject.y = select.selectedObject.y;
      
      socket.emit(EVENT.saveObject, saveObject);

    }

    isDown = false;

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


