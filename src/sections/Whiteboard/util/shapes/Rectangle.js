'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;

function Rectangle(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  this.objectType = 'rect';

  // Prefill Shape Model
  this.shape = {
    _id: '',
    userId: '',
    layerLevel: 0,
    rotation: 0,
    interactive: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    lineWidth: 0,
    lineColor: 0,
    fillColor: 0,
    lineAlpha: 0,
    fillAlpha: 0
  }

  // Set defaults
  this.lineWidth = 1;
  this.lineColor = 0x000000;
  this.fillColor = 0xFFFFFF;
  this.lineAlpha = 1;
  this.fillAlpha = 1;

}

//inherit(Rectangle, BaseShape);
Rectangle.prototype = new BaseShape();

// Get Properties for Socket (Does not include graphics object)
Rectangle.prototype.getProperties = function() {
  BaseShape.prototype.getProperties.call(this);
  //var origin = this.graphics.toLocal({x: 0, y: 0});

  // Get Rectangle properties
  this.shape.x = this.x;
  this.shape.y = this.y;
  this.shape.width = this.width;
  this.shape.height = this.height;
  this.shape.lineWidth = this.lineWidth;
  this.shape.lineColor = this.lineColor;
  this.shape.fillColor = this.fillColor;
  this.shape.lineAlpha = this.lineAlpha;
  this.shape.fillAlpha = this.fillAlpha;

  return shape;
};

Rectangle.prototype.setProperties = function(shapeProperties, stage) {

  BaseShape.prototype.setProperties.call(this, shapeProperties);

  // if(shapeProperties.x) this.graphics.position.x = shapeProperties.x;
  // if(shapeProperties.y) this.graphics.position.y = shapeProperties.y;
  //console.log('setProperties to ', shapeProperties);
  //var rectProperties = this.getProperties();

  if(shapeProperties.x) this.x;
  if(shapeProperties.y) this.y;

  if(shapeProperties.width) this.width = shapeProperties.width;
  if(shapeProperties.height) this.height = shapeProperties.height;

  if(shapeProperties.lineWidth) this.lineWidth = shapeProperties.lineWidth;
  if(shapeProperties.lineColor) this.lineColor = shapeProperties.lineColor;
  if(shapeProperties.fillColor) this.fillColor = shapeProperties.fillColor;
  if(shapeProperties.lineAlpha) this.lineAlpha = shapeProperties.lineAlpha;
  if(shapeProperties.fillAlpha) this.fillAlpha = shapeProperties.fillAlpha;  // Set Style properties to the internal Graphics object

  this.graphics.lineWidth = this.lineWidth;
  this.graphics.lineColor = this.lineColor;
  this.graphics.fillColor = this.fillColor;
  this.graphics.lineAlpha = this.lineAlpha;
  this.graphics.fillAlpha = this.fillAlpha;
  console.log('RECT', this);
};

Rectangle.prototype.draw = function(shapeProperties, stage) {
  this.graphics.clear();
  this.graphics.interactive = false;
  //console.log('shapeProps', shapeProperties);
  this.graphics.lineWidth = shapeProperties.lineWidth || this.lineWidth;
  this.graphics.lineColor = shapeProperties.lineColor || this.lineColor;
  this.graphics.fillColor = shapeProperties.fillColor || this.fillColor;
  this.graphics.lineAlpha = shapeProperties.lineAlpha || this.lineAlpha;
  this.graphics.fillAlpha = shapeProperties.fillAlpha || this.fillAlpha;

  this.graphics.drawRect(
    shapeProperties.x,
    shapeProperties.y,
    shapeProperties.width,
    shapeProperties.height
  );
  this.graphics.interactive = true;
  //this.graphics.dirty = true;
  stage.addChild(this.graphics);

  this.layerLevel = stage.children.length;

  return this;
};

Rectangle.prototype.move = function(x, y, stage) {

  this.graphics.position.x = x;
  this.graphics.position.y = y;
  //this.graphics.dirty = true;
  stage.addChild(this.graphics);
};

Rectangle.prototype.addNew = function(Shapes, userId) {
  // increment object type number
  var shapeCount = Rectangle.prototype.shapeCount + 1;
  var keyIndex = 0;
  //var shapeObject = {};
  this.userId = this.userId || userId;// || AppState.Users.currentUser._id;

  // Create Unique key
  this._id = this.objectType + Rectangle.prototype.shapeCount;

  console.log(this._id);

  while(this._id in Shapes) {
    shapeCount = shapeCount%2 === 0 ? shapeCount + 1
                                      : shapeCount;
    this._id = shapeCount + this._id + this.hashKeys[keyIndex];
    keyIndex = ++keyIndex%5;
    console.log(this._id);
  }

  Rectangle.prototype.shapeCount = shapeCount;

  // Set object in Shape Map
  Shapes[this._id] = this;

  return this;
}

Rectangle.prototype.hasher = function(Shapes) {}

// To keep track of the number of shapes of this type
Rectangle.prototype.shapeCount = 0;

Rectangle.prototype.hashKeys = ['#', '@', '&', '*', '%'];

Rectangle.prototype.setRectMoveListeners = function(AppState) {
  this.setMoveListeners(AppState);
  //var mousedown = this.graphics.mousedown.bind(this.graphics);
  //var mouseup = this.graphics.mouseup.bind(this.graphics);

  //console.log('settings rectangle mouse events', this.graphics);
  // console.log('Appstate', AppState.Tools);
  //this.graphics.interactive = true;

  // this.graphics.mousedown = function(data) {
  //   //data.originalEvent.preventDefault();

  //   console.log('set Rect special mouse down');
  //   //mousedown(data);
  // };


  // //AppState.Canvas.stage.addChild(this.graphics);
  // this.graphics.mouseover = function(data) {
  //   data.originalEvent.preventDefault();

  //   console.log('set Rect special mouse move');
  // };

  // this.graphics.mouseup = function(data) {
  //   data.originalEvent.preventDefault();

  //   console.log('set Rect special mouse up');
  //   mouseup(data);
  // };
}

// Rectangle.prototype.getGraphicsData = function(rect) {
//   rect = rect || {};
//   var graphicsData = this.graphics.graphicsData[0];

//   for(var prop in graphicsData) {
//     rect[prop] = graphicsData[prop];
//   }

//   return rect;
// }

// Rectangle.prototype.setGraphicsData = function(shapeProperties) {
//   var graphicsData = this.graphics.graphicsData[0];

//   for(var prop in shapeProperties) {
//     graphicsData[prop] = shapeProperties[prop];
//   }
// }


