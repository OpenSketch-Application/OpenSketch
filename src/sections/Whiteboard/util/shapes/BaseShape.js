'use strict';
var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = BaseShape;

// Abstract class, don't instantiate object
function BaseShape(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  this.highlightShape = new PIXI.Graphics();

  this.graphics.addChild(this.highlightShape);
};

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

  console.log('SETTINGS MOVE LISTENERS', this.graphics);

  this.interactive = this.graphics.interactive = true;

  this.graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    //data.originalEvent.preventDefault();
    console.log('click fired with', Tools.selected);
    if(Tools.selected === 'select') {
      //console.log('data:', this.originalOrigin);
      console.log('local pos', this.x, this.y);
      this.origin = data.getLocalPosition(this.graphics);
      console.log('new origin', this.origin.x, this.origin.y);
      this.alpha = 0.9;

      //graphics.selected = true;
      console.log('origin', this.origin);
      console.log('current User', Users.currentUser);
      this.currentUserId = Users.currentUser._id;

      Tools.select.selectedObject = this;
      this.selected = true;
      this.highlight();
      //Tools.select.clickedObject = true;

      socket.emit(EVENT.shapeObject, 'interactionBegin', this._id);
    }
    else if(Tools.selected === 'fill') {
      this.clear();

      this.draw({fillColor: Tools.fill.fillColor});

      socket.emit(EVENT.shapeObject, 'modify', this.getProperties());

      this.interactive = this.interactive = true;
    }
  }.bind(this);

  this.graphics.mouseup = function(data) {
    if(Tools.selected === 'select') {

      this.alpha = 1;
      this.origin = {
        x: this.graphics.position.x,
        y: this.graphics.position.y
      };
    }
    //movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  }.bind(this);
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
  //construct: construct,
  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,

  // Mouse Events
  setMoveListeners: setMoveListeners,
  move: move,
  moveTo: moveTo
};

/*
// Naive approach
function InvertColor(const Color: TColor): TColor;
begin
    result := TColor(Windows.RGB(255 - GetRValue(Color),
                                 255 - GetGValue(Color),
                                 255 - GetBValue(Color)));
end;

function InvertColor(const Color: TColor): TColor;
begin
  if (GetRValue(BackgroundColor) + GetGValue(BackgroundColor) + GetBValue(BackgroundColor)) > 384 then
    result := clBlack
  else
    result := clWhite;
end;

*/
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





