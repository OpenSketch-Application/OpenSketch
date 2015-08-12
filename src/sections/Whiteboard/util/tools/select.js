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
    //AppState.Canvas.stage.setMouseEvents(AppState);

    return false;
  });

  var stage = AppState.Canvas.stage;
  var pixiStage = AppState.Canvas.pixiStage;
  var Users = AppState.Users;
  var select = AppState.Tools.select;
  var socket = AppState.Socket;
  var shapeModified = false;
  var isDown = false;
  var isMouseOut = false;
  var shapeUnselected = false;
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
    isDown = true;

    if(select.selectedObject !== null) {
      select.selectedObject.unHighlight();
      select.selectedObject.selected = false;

      // UnLock at this point, since user is just clicking the Canvas and
      // not the previously selected Shape
      socket.emit(EVENT.shapeEvent, 'unlockShape', { _id: select.selectedObject._id });
      select.selectedObject = null;
    }
    // else {
    //   this.dragging = true;
    //   this.mousePressPoint[0] = data.getLocalPosition(pixiStage).x -
    //                             this.position.x;
    //   this.mousePressPoint[1] = data.getLocalPosition(pixiStage).y -
    //                             this.position.y;
    // }
  };

  var mousemove = function(data) {
    isMouseOut = false;

    // Set selected
    if(isDown && select.selectedObject !== null) {
      var selectedObject = select.selectedObject;

      // Reuse our preset modifiedShape object, for efficiency sake
      modifiedShape.x = data.getLocalPosition(stage).x - selectedObject.origin.x;
      modifiedShape.y = data.getLocalPosition(stage).y - selectedObject.origin.y;
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

      // Remember we don't wish to keep hitting the database for every move events, since
      // we fire off 100+ events, and accessing the DB each time for every pixil is
      // retarded, only persist changes User has completed the modification
      // So if he diconnects while still moving a Shape or drawing a Shape, it should be invalidated
      // by default, hence why we only save on mouseUp and if selected Shape had been modified
      if(isDown && shapeModified) {
        // Update the Shape Object
        // and it should also unlock the Shape
        //socket.emit(EVENT.updateObject, saveObject);
      }
      // Due to our inability to do proper delegation yet, we had to wait to BaseShape class's
      // mouseDown event to attach the shape that experienced a mouseDown to attach the shape
      // to AppState.select.selectedObject
      else {
        // Emit socket lockShape Event, since we know a Shape had been selected by now
        // socket.emit(EVENT.lockShape, 'lockShape', {
        //   _id: select.selectedObject._id,
        //   currentUserId: Users.currentUserId
        // });
      }
    }

    this.dragging = false;

    // Reset back to default
    isDown = shapeModified = false;
  }

  var mouseout = function() {
    isMouseOut = true;
  }

  var keydown = function(e) {
    if(AppState.Tools.selected === 'select') {
      var keycode;
      if (window.event) keycode = window.event.keyCode;
      else if (e) keycode = e.which;
      else return true;

      if ((keycode >= 48 && keycode <= 57) || keycode == 45 || keycode == 46 || keycode == 8){
        socket.emit(EVENT.removeShape, select.selectedObject._id, function(err) {
          if(err) {
            console.error(err);
          } else {
            AppState.Canvas.Shapes.removeShapeByID(select.selectedObject._id);
          }
        });
      }
    }
  };

  document.addEventListener('keydown', keydown);
  document.querySelector('#chatarea').onfocus = function(e) {
    document.removeEventListener('keydown', keydown);
  };

  document.querySelector('#chatarea').onblur = function(e) {
    document.addEventListener('keydown', keydown);
  };

  AppState.GlobalEvents['keydown'] = keydown;
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

