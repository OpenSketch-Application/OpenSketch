'use strict';
PIXI = require('pixi');
var EVENTS = require('../../../../model/model');

module.exports = BaseShape;

// Abstract class, don't instantiate object
function BaseShape() {};

// Should be called only by Shape objects that inherit BaseShape
var getProperties = function(shapeModel) {
  shapeModel._id = this._id;
  shapeModel.originalUserId = this.originalUserId;
  shapeModel.currentUserId = this.currentUserId;
  shapeModel.layerLevel = this.layerLevel;
  shapeModel.rotation = this.rotation;
  shapeModel.interactive = this.interactive;

  return shapeModel;
};

var setProperties = function(shapeProperties) {
  this._id = shapeProperties._id || '';
  this.originalUserId = shapeProperties.originalUserId;
  this.currentUserId = shapeProperties.currentUserId;
  this.layerLevel = shapeProperties.layerLevel || 0;

  // Set Graphics specific properties
  this.rotation = this.graphics.rotation = shapeProperties.rotation || 0;
  this.interactive = this.graphics.interactive = this.interactive = shapeProperties.interactive || false;
};

var setMoveListeners = function(AppState) {
  var selected = false;
  var Tools = AppState.Tools;
  var Users = AppState.Users;
  var socket = AppState.Socket;
  var _this = this;
  _this.origin = {};
  this.interactive = this.graphics.interactive = true;

  this.graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    //data.originalEvent.preventDefault();
    console.log('click fired with', Tools.selected);
    if(Tools.selected === 'select') {
      _this.origin = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      //graphics.selected = true;
      console.log('origin', _this.origin);
      console.log('current User', Users.currentUser);
      _this.currentUserId = Users.currentUser._id;
      Tools.select.selectedObject = _this;

      socket.emit(EVENTS.sendRect, 'interactionBegin', _this._id);
    }
    else if(Tools.selected === 'fill') {
      this.clear();
      console.log('fill Color: ' + Tools.fill.fillColor);
      console.log('fill this', _this);
      _this.draw({fillColor: Tools.fill.fillColor});
      //_this.interactive = this.graphics.interactive = true;
    }

  }.bind(this.graphics);

  this.graphics.mouseup = function(data) {
    if(Tools.selected === 'select') {
      selected = false;
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

// Use Parasitic Combination Inheritance Pattern
BaseShape.prototype = {

  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,

  // Mouse Events
  setMoveListeners: setMoveListeners,
  move: move
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





