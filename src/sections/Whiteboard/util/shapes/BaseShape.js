'use strict';
PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = BaseShape;

// Abstract class, don't instantiate object
function BaseShape() {};

var init = function(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  this.hightlightShape = new PIXI.Graphics();

  this.graphics.addChild(this.hightlightShape);



  // User properties will be set by Shapes class
  this._id = '';
  this.originalUserId = '';
  this.currentUserId = '';

  this.layerLevel = shapeProperties.layerLevel || 0;
  this.selected = false;

  // Set Graphics specific properties
  this.scale = this.graphics.scale = shapeProperties.scale || 1;
  this.rotation = this.graphics.rotation = shapeProperties.rotation || 0;
  this.interactive = this.graphics.interactive = this.interactive = shapeProperties.interactive || false;
}

// Should be called only by Shape objects that inherit BaseShape
var getProperties = function(shapeModel) {
  shapeModel._id = this._id;
  shapeModel.originalUserId = this.originalUserId;
  shapeModel.currentUserId = this.currentUserId;
  shapeModel.layerLevel = this.layerLevel;
  shapeModel.rotation = this.rotation;
  shapeModel.interactive = this.interactive;
  shapeModel.scale = this.scale;

  return shapeModel;
};

var setProperties = function(shapeProperties) {
  this._id = shapeProperties._id || '';
  this.originalUserId = shapeProperties.originalUserId;
  this.currentUserId = shapeProperties.currentUserId;
  this.layerLevel = shapeProperties.layerLevel || 0;
  this.scale = shapeProperties.scale || 1;
  this.selected = false;

  // Set Graphics specific properties
  this.rotation = this.graphics.rotation = shapeProperties.rotation || 0;
  this.interactive = this.graphics.interactive = this.interactive = shapeProperties.interactive || false;
};

var setMoveListeners = function(AppState) {
  var Tools = AppState.Tools;
  var Users = AppState.Users;
  var socket = AppState.Socket;
  var _this = this;
  this.origin = {
    x: this.x,
    y: this.y
  };

  console.log('SETTINGS MOVE LISTENERS', this.origin);

  this.interactive = this.graphics.interactive = true;

  this.graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    //data.originalEvent.preventDefault();
    console.log('click fired with', Tools.selected);
    if(Tools.selected === 'select') {
      _this.origin = data.getLocalPosition(this);
      this.alpha = 0.9;

      //graphics.selected = true;
      console.log('origin', _this.origin);
      console.log('current User', Users.currentUser);
      _this.currentUserId = Users.currentUser._id;

      Tools.select.selectedObject = _this;
      Tools.select.clickedObject = true;

      socket.emit(EVENT.shapeObject, 'interactionBegin', _this._id);
    }
    else if(Tools.selected === 'fill') {
      this.clear();
      console.log('fill Color: ' + Tools.fill.fillColor);
      console.log('fill this', _this);
      console.log('socket', socket);
      _this.draw({fillColor: Tools.fill.fillColor});

      socket.emit(EVENT.shapeObject, 'modify', _this.getProperties());

      _this.interactive = this.interactive = true;
    }
  }.bind(this.graphics);

  this.graphics.mouseup = function(data) {
    if(Tools.selected === 'select') {

      this.alpha = 1;

    }
    //movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  }.bind(this.graphics);
};

var move = function(moveObject) {
  this.graphics.position.x = moveObject.x;
  this.graphics.position.y = moveObject.y;
};

var moveTo = function(vector) {
  console.log('vector', vector, 'origin', this.origin);
  this.x = vector.x - this.origin.x;
  this.y = vector.y - this.origin.y;
  this.graphics.position.x = this.x;
  this.graphics.position.y = this.y;
}

// Use Parasitic Combination Inheritance Pattern
BaseShape.prototype = {

  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,

  // Mouse Events
  setMoveListeners: setMoveListeners,
  move: move,
  moveTo: moveTo
};

// Object.defineProperties(BaseShape.prototype, {
//   layerLevel: {
//     get: function() {
//       if(this.graphics.stage)
//         return this._layerLevel = this.graphics.stage.getChildAt(this.graphics);
//       else
//         return this._layerLevel;
//     },
//     set: function(level) {
//       this._layerLevel = level;
//       //if(this.graphics.stage)
//       //this.graphics.stage.addChildAt(level);
//       // else
//       //   throw new Error('stage not set yet');
//         //console.log('Warning!: Stage has not yet been set');
//     }
//   }
// });





