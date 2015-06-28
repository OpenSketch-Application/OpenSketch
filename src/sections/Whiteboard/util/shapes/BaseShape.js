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

var setProperties = function(shapeProperties) {
  if(shapeProperties._id) this._id = shapeProperties._id;
  if(shapeProperties.userId) this.userId = shapeProperties.userId;
  if(shapeProperties.rotation) this.rotation = shapeProperties.rotation;
  if(shapeProperties.layerLevel) this.layerLevel = shapeProperties.layerLevel;
  if(shapeProperties.interactive) this.interactive = shapeProperties.interactive;
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
    console.log('click fired with', AppState.Tools.selected);
    if(AppState.Tools.selected === 'select') {
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
      console.log('fill Color: ' + AppState.Tools.fill.fillColor);
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
  // Construction
  //create: create,

  // Getter/Setters
  getProperties: getProperties,
  setProperties: setProperties,

  // Methods
  // Mouse Events
  setMoveListeners: setMoveListeners

};







