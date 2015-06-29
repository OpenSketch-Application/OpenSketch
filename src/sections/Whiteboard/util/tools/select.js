var PIXI = require('pixi');
var EVENTS = require('../../../../model/model').socketEvents;

module.exports = function(AppState, el) {

  el.addEventListener('click', function(e) {
    //console.log('click fired');
    AppState.Tools.selected = 'select';
    activate();
  });

  var stage = AppState.Canvas.stage;
  var Select = AppState.Tools.select;
  var Socket = AppState.Socket;
  var mouseData;
  var selected = false;
  //var Stage = AppState.Canvas.stage;

  var mousedown = function(data) {
    //data.originalEvent.preventDefault();

    selected = true;
    //Select.selectedObject !== null;
    //console.log('Select.selectedObject', Select.selectedObject !== null);
    //console.log(data);
    //console.log(data.target);
    // Fire off selected ObjectId to server
    //Socket.emit(EVENTS.);
  };

  var mousemove = function(data) {
    data.originalEvent.preventDefault();

    // Set selected
    if(selected = Select.selectedObject !== null) {
      console.log('move ', selected);
      var selectedObject = Select.selectedObject;
      var x = data.global.x - selectedObject.origin.x;
      var y = data.global.y - selectedObject.origin.y;
      selectedObject.move(x, y, stage);
    }
  };

  var mouseup = function(data) {
    if(selected) {
      Select.selectedObject = null;
      selected = false;
    }
  }
  var mouseout = function(data) {
    selected = false;
    Select.selectedObject = null;
  }

  // Return true for now, might decide to implement more complexity for
  // complex shapes
  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseout;
  }

  return true;
}


