'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;

function Rectangle(shapeProperties, stage) {
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

  // Check stage children size, before attaching
  this.layerLevel = stage.children.length;

  stage.addChild(this.graphics);
}

// Set prototype to the BaseShape
Rectangle.prototype = new BaseShape();

// Get Properties for Socket (Does not include graphics object)
Rectangle.prototype.getProperties = function() {
  // Get Rectangle properties
  var shape = {
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
    lineWidth: this.lineWidth,
    lineColor: this.lineColor,
    fillColor: this.fillColor,
    lineAlpha: this.lineAlpha,
    fillAlpha: this.fillAlpha
  }

  // Get the base properties and have it attached to temporary our shape object
  BaseShape.prototype.getProperties.call(this, shape);

  return shape;
};

Rectangle.prototype.setProperties = function(shapeProperties, stage) {

  BaseShape.prototype.setProperties.call(this, shapeProperties);

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

};

Rectangle.prototype.draw = function(shapeProperties, stage) {
  this.graphics.clear();
  this.graphics.interactive = false;

  // Since we cleared all the properties for redrawing, we need to set the styles again
  this.graphics.lineWidth = shapeProperties.lineWidth || this.lineWidth;
  this.graphics.lineColor = shapeProperties.lineColor || this.lineColor;
  this.graphics.lineAlpha = shapeProperties.lineAlpha || this.lineAlpha;
  this.graphics.fillAlpha = shapeProperties.fillAlpha || this.fillAlpha;
  this.graphics.fillColor = shapeProperties.fillColor || this.fillColor;

  this.graphics.beginFill(this.graphics.fillColor);

  // Redraw the shape
  this.graphics.drawRect(
    shapeProperties.x,
    shapeProperties.y,
    shapeProperties.width,
    shapeProperties.height
  );

  stage.addChild(this.graphics);

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

  if(Shapes[this._id] !== null) {
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

Rectangle.prototype.remove = function(Shapes) {
  Rectangle.prototype.shapeCount = Rectangle.prototype.shapeCount - 1;
  Shapes[this._id] = null;
}

Rectangle.prototype.hasher = function(Shapes) {}

// To keep track of the number of shapes of this type
Rectangle.prototype.shapeCount = 0;

Rectangle.prototype.hashKeys = ['#', '@', '&', '*', '%'];

Rectangle.prototype.setRectMoveListeners = function(AppState) {
  this.setMoveListeners(AppState);
  //var mousedown = this.graphics.mousedown.bind(this.graphics);
  //var mouseup = this.graphics.mouseup.bind(this.graphics);

  console.log('settings rect mouse events', this.graphics);
  console.log('Appstate', AppState.Tools);

  // this.graphics.mousedown = function(data) {
  //   data.originalEvent.preventDefault();

  //   console.log('set Rect special mouse down');
  //   mousedown(data);
  // };

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

Rectangle.prototype.getGraphicsData = function(rect) {
  var graphicsData = this.graphics.graphicsData[0];

  for(var prop in graphicsData) {
    // Prevent us from copying function data
    rect[prop] = graphicsData[prop];
  }

  return rect;
}

var times = [];

function testObjHashRetrival() {
  times[0] = Date.now();
  var Obj = function() {};

  Obj.prototype.hasher = function() {
    this.shapeCount++;
    this.hashKeys = ['#@&*%'];
  }
}


