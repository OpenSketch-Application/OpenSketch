'use strict';
var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = BaseShape;

// Abstract class, don't instantiate the object to draw anything,
// since this class is meant to represent the Base properties all other
// basic shapes and Complex shapes need, Free hand drawing (pencil) is the exception
function BaseShape(shapeProperties, graphicsType) {
  switch(graphicsType) {
    case 'sprite':
      this.graphics = new PIXI.Sprite();
      break;
    default:
      this.graphics = new PIXI.Graphics();
      break;
  }

  this.highlightShape = new PIXI.Graphics();
  this.selectablePoints = new PIXI.Graphics();
  this.graphics.addChildAt(this.highlightShape, 0);
  this.graphics.addChildAt(this.selectablePoints, 1);
  this.layerLevel = 0;

  //BaseShape.prototype.setProperties.call(this, shapeProperties);
};
//
// Normally called by Shape objects that inherit BaseShape
var getProperties = function() {
  var shapeProperties = {
    _id: this._id,
    originalUserId: this.originalUserId,
    currentUserId: this.currentUserId,
    layerLevel: this.layerLevel,
    rotation: this.rotation,
    interactive: this.interactive,
    scale: this.scale
  };

  return shapeProperties;
};

// Called by shape objects that need to set Base properties
// Eg. BaseShape.prototype.setProperties.call(DerviedShape, {});
var setProperties = function(shapeProperties) {
  // These properties will be set by AppState's Shapes object
  // It will set these properties based on the Session context and
  // User
  this._id = shapeProperties._id || '';
  this.originalUserId = shapeProperties.originalUserId;
  this.currentUserId = shapeProperties.currentUserId;
  this.layerLevel = shapeProperties.layerLevel || 0;

  // This will indicate whether the user has selected this object in the Canvas
  // This is normally toggled when Select tool is selected and User clicks on
  // this shape
  this.selected = false;

  // This will be set by socket events when another participant has selected
  // this object to manipulate
  this.locked = false;

  // Set Graphics specific properties
  this.scale = shapeProperties.scale || { x: 1, y: 1 };
  this.rotation = this.graphics.rotation = shapeProperties.rotation || 0;
  this.graphics.interactive = this.interactive = shapeProperties.interactive || false;
};

// Sets the listeners to handle Movement and Selection as well
var setMoveListeners = function(AppState) {
  var Tools = AppState.Tools;
  var Users = AppState.Users;
  var socket = AppState.Socket;
  var stage = AppState.Canvas.stage;

  // The current position of this Shape, ie. its Top, Left coordinates
  // relative to Canvas' Top, Left coords
  this.origin = {
    x: this.x,
    y: this.y
  };

  // Interactivity allows User's to interact with this shape, the listeners
  // will actually be toggled based on whether interactive is set to true/false
  this.interactive = this.graphics.interactive = true;

  // Since we don't have event bubbling, we need to have a close relationship between
  // Select tool's mouse events and the selected Shape's events
  this.graphics.mousedown = function(data) {
    // Do early return if shape is locked, due to another User manipulating this Shape
    if(this.locked) return;

    //data.originalEvent.preventDefault();
    if(Tools.selected === 'select') {
      this.origin =  {
        x: data.getLocalPosition(stage).x - this.graphics.position.x,
        y: data.getLocalPosition(stage).y - this.graphics.position.y
      };

      this.alpha = 0.9;

      // Set the User who is currently manipulating the Shape,
      // Note: the currentUserId can be different from OriginalUserId
      // if a user other than the current user manipulates this Shape
      // via Socket events
      this.currentUserId = Users.currentUser._id;

      Tools.select.selectedObject = this;

      // Since the Selected tool is the 'Select' tool, if we register a mouse click
      // we should set the selected property to true
      this.selected = true;

      // Since tool is selected we should also highlight the tool
      // Normally highlight() will be defined by Derived tool, since the shape of
      // the highlight tool might vary depending on the Shape, ie. Ellipse or Rectangle
      this.highlight();

      // use socket emit to other User's that this object is selected by this user, and should
      // be locked for them
      socket.emit(EVENT.shapeEvent, 'lockShape', {
          _id: this._id,
          currentUserId: this.currentUserId
        }
      );
    }
    // If the selected tool is Fill tool
    else if(Tools.selected === 'fill') {
      this.graphics.clear();

      // Pass the new Fill color to the Shape's draw method
      this.draw({ fillColor: Tools.fill.fillColor });

      // Emit a modify event, and send the Shape properties
      // We probably should only send the new Color rather than all Shape
      // properties
      socket.emit(EVENT.shapeEvent, 'modify', this.getProperties());

      socket.emit(EVENT.updateObject, this.getProperties());

      // Turn interactive back on after clearing Graphics
      this.interactive = this.graphics.interactive = true;
    }

  }.bind(this);

  // Need this for Select tool, since it needs to know if
  // Shape had been moved, thus it will read the this.origin property
  this.graphics.mouseup = function(data) {
    if(Tools.selected === 'select') {
      this.alpha = 1;
      this.origin = {
        x: this.graphics.position.x,
        y: this.graphics.position.y
      };
    }
  }.bind(this);
};

var move = function(vector) {
  this.graphics.position.x = vector.x;
  this.graphics.position.y = vector.y;
};

// Returns the Current graphics container, it can be either a Graphic or Sprite
var getGraphics = function() {
  return this.graphics;
}

BaseShape.prototype = {
  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,
  getGraphics: getGraphics,

  // Mouse Events
  setMoveListeners: setMoveListeners,
  move: move,
  moveTo: moveTo,

  // UI indicator methods, will be abstract
  highlight: function() { console.log('called base highlight'); },
  unHighlight: function() { console.log('called base UnHighLight'); },

  // Shape locking/unlocking methods
  lockShape: function(userId) {
    console.log('LOCKing shape');
    this.currentUserId = userId;
    this.highlight(0xFF0000);
    //this.interactive = this.graphics.interactive = false;
    this.locked = true;
  },
  unLockShape: function() {
    console.log('unLOCKing shape');

    this.interactive = this.graphics.interactive = true;
    this.unHighlight();
    this.locked = false;
  }
  /*To Do: Potentially implement methods that shows UI features around the shape */
  // showSelectableUI
  // hideSelectableUI
};





