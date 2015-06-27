'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;
// var create = function(o) {
//   function F() {};

//   F.prototype = o;
//   return new F();
// };

// var inherit = function(child, parent) {
//   var copyParent = create(parent);

//   copyParent.constructor = child;

//   child.prototype = copyParent;
// };

function Rectangle(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  BaseShape.prototype.setProperties.call(this, shapeProperties);
  this.objectType = 'rect';
  this.graphics.x = shapeProperties.x || 0;
  this.graphics.y = shapeProperties.y || 0;
  this.graphics.width = shapeProperties.width || 0;
  this.graphics.height = shapeProperties.height || 0;
  this.graphics.lineWidth = shapeProperties.lineWidth || 1;
  this.graphics.lineColor = shapeProperties.lineColor || 0x000000;
  this.graphics.fillColor = 0xFFFFFF; //shapeProperties.fillColor || 0xFFFFFF;
}

//inherit(Rectangle, BaseShape);
Rectangle.prototype = new BaseShape();

// Get Properties for Socket (Does not include graphics object)
Rectangle.prototype.getProperties = function() {
  var rect = BaseShape.prototype.getProperties.call(this);
  var origin = this.graphics.toLocal({x: 0, y: 0});

  console.log(origin);
  console.log(this.graphics);
  rect = this.getGraphicsData(rect);
  // rect.x = this.graphics.x;
  // rect.y = this.graphics.y;
  // rect.width = this.graphics.width;
  // rect.height = this.graphics.height;
  // rect.lineWidth = this.graphics.lineWidth;
  // rect.lineColor = this.graphics.lineColor;
  // rect.fillColor = this.graphics.fillColor;

  return rect;
};

Rectangle.prototype.setProperties = function(shapeProperties) {
  BaseShape.prototype.setBaseProperties.call(rect, shapeProperties);
  if(shapeProperties.x) this.graphics.position.x = shapeProperties.x;
  if(shapeProperties.y) this.graphics.position.y = shapeProperties.y;
  if(shapeProperties.width) this.graphics.position.width = shapeProperties.width;
  if(shapeProperties.height) this.graphics.position.height = shapeProperties.height;
  if(shapeProperties.lineWidth) this.graphics.lineWidth = shapeProperties.lineWidth;
  if(shapeProperties.lineColor) this.graphics.lineColor = shapeProperties.lineColor;
  if(shapeProperties.fillColor) this.graphics.fillColor = 0xFFFFFF;//shapeProperties.fillColor;
  //this.graphics.fillColor = 0xFFFFFF;
  //this.graphics.dirty = true;
};

Rectangle.prototype.draw = function(shapeProperties, stage) {
  this.graphics.clear();
  this.graphics.interactive = false;
  this.graphics.beginFill(0xFFFFFF); // style.fillColor
  this.graphics.lineWidth = 1;//shapeProperties.lineWidth || this.lineWidth; // style.lineWidth
  this.graphics.lineColor = 0x000000; // style.lineColor

  this.graphics.drawRect(
    shapeProperties.x,
    shapeProperties.y,
    shapeProperties.width,
    shapeProperties.height
  );

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
  this.userId = userId || 'unkown';// || AppState.Users.currentUser._id;

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


