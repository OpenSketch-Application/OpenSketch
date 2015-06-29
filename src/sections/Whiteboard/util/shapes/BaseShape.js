'use strict';
PIXI = require('pixi');
module.exports = BaseShape;

// Abstract class, don't instantiate object
function BaseShape() {};

var getProperties = function(shapeModel) {
  shapeModel._id = this._id;
  shapeModel.userId = this.userId;
  shapeModel.layerLevel = this.layerLevel;
  shapeModel.rotation = this.graphics.rotation;
  shapeModel.interactive = this.graphics.interactive;

  return shapeModel;
};

var setProperties = function(shapeProperties, stage) {
  this._id = shapeProperties._id || null;
  this.userId = shapeProperties.userId || null;
  this.rotation = shapeProperties.rotation || 0;
  this.layerLevel = shapeProperties.layerLevel || stage.children.length;
  this.interactive = shapeProperties.interactive || false;
  this.stage = stage;
};

var setMoveListeners = function(AppState) {
  var selected = false;
  var Tools = AppState.Tools;

  var _this = this;
  _this.origin;
  this.graphics.interactive = true;

  this.graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    //data.originalEvent.preventDefault();
    console.log('click fired with', Tools.selected);
    if(Tools.selected === 'select') {
      console.log('checking info here');
      _this.origin = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      //graphics.selected = true;
      console.log('origin', _this.origin);

      Tools.select.selectedObject = _this;

      //AppState.Tools.select.mouseData = data;
    }
    else if(AppState.Tools.selected === 'fill') {
      this.clear();
      console.log('fill Color: ' + Tools.fill.fillColor);
      //this.endFill(AppState.Tools.fill.fillColor);
      //AppState.Canvas.stage.addChild(this);
    }
  }.bind(this.graphics);

  this.graphics.mouseup = function(data) {
    //data.originalEvent.preventDefault();
    selected = false;
    this.alpha = 1;

    //movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  }.bind(this.graphics);
};

// Use Parasitic Combination Inheritance Pattern
BaseShape.prototype = {

  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,

  // Mouse Events
  setMoveListeners: setMoveListeners

};







