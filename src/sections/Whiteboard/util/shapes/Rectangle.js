'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;

function Rectangle(shapeProperties) {
  BaseShape.prototype.setProperties.call(this, shapeProperties);
  this.objectType = 'rect',
  this.graphics.x = shapeProperties.x || 0;
  this.graphics.y = shapeProperties.y || 0;
  this.graphics.width = shapeProperties.width || 0;
  this.graphics.height = shapeProperties.height || 0;
  this.graphics.lineWidth = shapeProperties.lineWidth || 1;
  this.graphics.lineColor = shapeProperties.lineColor || 0x000000;
  this.graphics.fillColor = shapeProperties.fillColor || 0xFFFFFF;
}

Rectangle.prototype = new BaseShape();

Rectangle.prototype.getProperties = function() {
  var rect = BaseShape.prototype.getBaseProperties.call(this);
  rect.graphics.position.x = this.graphics.position.x;
  rect.graphics.position.y = this.graphics.position.y;
  rect.width = this.graphics.width;
  rect.height = this.graphics.height;
  rect.lineWidth = this.graphics.lineWidth;
  rect.lineColor = this.graphics.lineColor;
  rect.fillColor = this.graphics.fillColor;

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
  if(shapeProperties.fillColor) this.graphics.fillColor = shapeProperties.fillColor;

};

Rectangle.prototype.draw = function(shapeProperties, stage) {
  this.graphics.clear();
  this.graphics.interactive = false;
  this.graphics.beginFill(shapeProperties.fillColor); // style.fillColor
  this.graphics.lineWidth = shapeProperties.lineWidth; // style.lineWidth
  this.graphics.lineColor = shapeProperties.lineColor; // style.lineColor

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

Rectangle.prototype.move = function(shapeProperties, stage) {
  this.graphics.position.x = shapeProperties.x;
  this.graphics.position.y = shapeProperties.y;

  stage.addChild(this.graphics);
};

Rectangle.prototype.addNew = function(Shapes) {
  // increment object type number
  var shapeCount = Rectangle.prototype.shapeCount + 1;
  console.log(Rectangle.prototype);
  var keyIndex = 0;
  //var shapeObject = {};
  this.userId = this.userId || 'unkown';// || AppState.Users.currentUser._id;

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

var times = [];

function testObjHashRetrival() {
  times[0] = Date.now();
  var Obj = function() {};

  Obj.prototype.hasher = function() {
    this.shapeCount++;
    this.hashKeys = ['#@&*%'];
  }
}


