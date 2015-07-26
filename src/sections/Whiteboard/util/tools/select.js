var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(AppState, el) {

  el.addEventListener('click', function(e) {
    e.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    AppState.Tools.selected = 'select';

    activate();

    return false;
  });

  var stage = AppState.Canvas.stage;
  var Users = AppState.Users;
  var select = AppState.Tools.select;
  var socket = AppState.Socket;
  var shapeModified = false;
  var isDown = false;
  var modifiedShape = {
    x: 0,
    y: 0,
    currentUserId: Users.currentUserId,
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

      select.selectedObject.unHighlight();
      select.selectedObject.selected = false;

      // UnLock at this point, since user is just clicking the Canvas and
      // not the previously selected Shape
      socket.emit(EVENT.shapeEvent, 'unlockShape', { _id: select.selectedObject._id });
      select.selectedObject = null;
    }
  };

  var mousemove = function(data) {
    //data.originalEvent.preventDefault();

    // Set selected
    if(isDown && select.selectedObject !== null) {
      var selectedObject = select.selectedObject;

      // Reuse our preset modifiedShape object, for efficiency sake
      modifiedShape.x = data.global.x - selectedObject.origin.x;
      modifiedShape.y = data.global.y - selectedObject.origin.y;
      modifiedShape._id = selectedObject._id;

      // Call the Shape's move method, with updated properties
      selectedObject.move(modifiedShape);

      // Emit the move event to other Users, so that they can see the pretty shape
      // dancing!
      socket.emit(EVENT.shapeEvent, 'move', modifiedShape);

      // A flag to tell us a Shape has just been modified
      shapeModified = true;
    }
  };
  // On mouseUp: deselect object and remove lock
  // However, if Select has an shape selected,
  // Perform the steps for selecting a Shape
  var mouseup = function(data) {
    if(select.selectedObject) {
      var shapeId = select.selectedObject._id;

      // Emit socket interactionEnd Event, since drawing has ended on mouse up
      //socket.emit(EVENT.shapeEvent, 'interactionEnd', shapeId);
       saveObject = select.selectedObject.getProperties();
       saveObject.moveX = modifiedShape.x;
       saveObject.moveY = modifiedShape.y;
       saveObject.hasMoved = true;
      // saveObject._id = modifiedShape._id;
      // saveObject.x = select.selectedObject.x;
      // saveObject.y = select.selectedObject.y;

      // Remember we don't wish to keep hitting the database for every move events, since
      // we fire off 100+ events, and accessing the DB each time for every pixil is
      // retarded, only persist changes User has completed the modification
      // So if he diconnects while still moving a Shape or drawing a Shape, it should be invalidated
      // by default, hence why we only save on mouseUp and if selected Shape had been modified
      if(isDown && shapeModified) {
        // Update the Shape Object
        // and it should also unlock the Shape
        socket.emit(EVENT.updateObject, saveObject);
      }

      // Due to our inability to do proper delegation yet, we had to wait to BaseShape class's
      // mouseDown event to attach the shape that experienced a mouseDown to attach the shape
      // to AppState.select.selectedObject
      //else {
      // Emit socket lockShape Event, since we know a Shape had been selected by now
      socket.emit(EVENT.lockShape, 'lockShape', {
        _id: select.selectedObject._id,
        currentUserId: Users.currentUserId
      });
      //}
    }

    // Reset back to default
    isDown = shapeModified = false;
  }

  var deleteShape = function(e) {
    if (e.type == "keypress") {
      console.log('keypress', e.type);
    }
  }

  // Return true for now, might decide to implement more complexity for
  // complex shapes
  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseup; // should also contain same methods as mouseup
    document.addEventListener('keypress', deleteShape);
  }

  return true;
}


