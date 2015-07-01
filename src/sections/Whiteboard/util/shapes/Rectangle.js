'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;

function Rectangle(shapeProperties, userId) {
  this.graphics = new PIXI.Graphics();
  this.highlightShape = new PIXI.Graphics();
  this.graphics.addChild(this.highlightShape);
  this.objectType = 'rectangle';

  // Prefill Shape Model
  // this.shape = {
  //   _id: '',
  //   userId: '',
  //   layerLevel: 0,
  //   rotation: 0,
  //   interactive: false,
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  //   lineWidth: 0,
  //   lineColor: 0,
  //   fillColor: 0,
  //   lineAlpha: 0,
  //   fillAlpha: 0
  // }

  // Adding Shapes
  // var ShapeLayer = [];
  // var ShapeMap = {};

  // Socket will always identify a shape based on its ID
  // not its index
  // ShapeMap['id1'] = {
  //   'name': 'id1',
  //   'layerLevel': ShapeLayer.length
  // };

  // Add Shape to our array map as well
  //ShapeLayer.push(ShapeMap['id1']);

  // Insert at specific point
  // receives index value
  // 1) Check if index element contains any object?
  // 2) Add object at index, using splice
  // addAt(shape, index)

  // Swapping Shapes
  // swapShapes(shape1, index1, shape2, index2)
  /* When remove happens
  // Check if one remove called, simply clear the graphics of shape at index
  1) take the removed ShapeIndex

  */

  this.setProperties(shapeProperties);
  // this.stage = stage;
  // Set stage index, before attaching
  // this.layerLevel = stage.children.length;

  // stage.addChildAt(this.graphics, this.layerLevel);
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

Rectangle.prototype.setProperties = function(shapeProperties) {

  // Set Base properties by calling Base's set method
  BaseShape.prototype.setProperties.call(this, shapeProperties);

  if(shapeProperties.x) this.x = shapeProperties.x || 0;
  if(shapeProperties.y) this.y = shapeProperties.y || 0;

  if(shapeProperties.width) this.width = shapeProperties.width || 0;
  if(shapeProperties.height) this.height = shapeProperties.height || 0;

  this.lineWidth = shapeProperties.lineWidth || 1; // if(shapeProperties.lineWidth)
  this.lineColor = shapeProperties.lineColor || 0x000000; // if(shapeProperties.lineColor)
  this.fillColor = shapeProperties.fillColor || 0xFFFFFF; // if(shapeProperties.fillColor)
  this.lineAlpha = shapeProperties.lineAlpha || 1; // if(shapeProperties.lineAlpha)
  this.fillAlpha = Number.parseFloat(shapeProperties.fillAlpha || 1);   // if(shapeProperties.fillAlpha)

  // Set Style properties to the internal Graphics object
  this.graphics.lineWidth = this.lineWidth;
  this.graphics.lineColor = this.lineColor;
  this.graphics.fillColor = this.fillColor;
  this.graphics.lineAlpha = this.lineAlpha;
  this.graphics.fillAlpha = this.fillAlpha;
  //this.graphics.alpha = 0.25;
};

Rectangle.prototype.draw = function(shapeProperties) {
  this.graphics.clear();
  this.graphics.interactive = false;

  if(shapeProperties.x) this.x = shapeProperties.x;
  if(shapeProperties.y) this.y = shapeProperties.y;
  if(shapeProperties.width) this.width = shapeProperties.width;
  if(shapeProperties.height) this.height = shapeProperties.height;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again
  this.lineWidth = this.graphics.lineWidth = shapeProperties.lineWidth || this.lineWidth;
  this.lineColor = this.graphics.lineColor = shapeProperties.lineColor || this.lineColor;
  this.lineAlpha = this.graphics.lineAlpha = shapeProperties.lineAlpha || this.lineAlpha;
  this.fillAlpha = this.graphics.fillAlpha = shapeProperties.fillAlpha || this.fillAlpha;
  this.fillColor = this.graphics.fillColor = shapeProperties.fillColor || this.fillColor;

  this.graphics.beginFill(this.fillColor);

  // Redraw the shape
  this.graphics.drawRect(
    this.x,
    this.y,
    this.width,
    this.height
  );

  console.log('ShapeProperties ', shapeProperties)
  console.log('Line width', this.lineWidth, this.graphics.lineWidth);
  console.log('lineColor', this.lineColor, this.graphics.lineColor);
  console.log('fillColor', this.fillColor, this.graphics.fillColor);

  //this.graphics.stage.addChildAt(this.graphics, this.layerLevel);

  return this;
};

Rectangle.prototype.move = function(x, y) {

  this.graphics.position.x = x;
  this.graphics.position.y = y;
};

// Rectangle.prototype.remove = function(Shapes) {
//   Rectangle.prototype.shapeCount = Rectangle.prototype.shapeCount - 1;
//   Shapes[this._id] = null;
// }

Rectangle.prototype.hasher = function(Shapes) {}

// To keep track of the number of shapes of this type
Rectangle.prototype.shapeCount = 0;

Rectangle.prototype.hashKeys = ['#', '@', '&', '*', '%'];

Rectangle.prototype.getGraphicsData = function() {
  var graphicsData = this.graphics.graphicsData[0];

  var graphics = {
    lineWidth: graphicsData.lineWidth,
    lineColor: graphicsData.lineColor,
    lineAlpha: graphicsData.lineAlpha,
    fillAlpha: graphicsData.fillAlpha,
    fillColor: graphicsData.fillColor
  }

  return graphics;
}

Rectangle.prototype.setGraphicsData = function(graphics) {
  var graphicsData = this.graphics.graphicsData[0];

  graphicsData.lineWidth = this.lineWidth = (graphics.lineWidth || this.lineWidth);
  graphicsData.lineColor = this.lineColor = (graphics.lineColor || this.lineColor);
  graphicsData.lineAlpha = this.lineAlpha = (graphics.lineAlpha || this.lineAlpha);
  graphicsData.fillAlpha = this.fillAlpha = (graphics.fillAlpha || this.fillAlpha);
  graphicsData.fillColor = this.fillColor = (graphics.fillColor || this.fillColor);

  this.graphics.dirty = true;
}

Rectangle.prototype.highlight = function(color) {
  this.highlightShape.clear();
  this.highlightShape.lineWidth = this.lineWidth + 2;
  this.highlightShape.lineColor = 0x2D8EF0;
  //this.highlightShape.lineColor = color || 0x0000FF;
  this.highlightShape.alpha = 1;

  this.highlightShape.drawRect(
    this.x,
    this.y,
    this.width,
    this.height
  );

  this.graphics.addChildAt(this.highlightShape, 0);
}

Rectangle.prototype.unHighlight = function() {
  this.highlightShape.clear();
}

Rectangle.prototype.setRectMoveListeners = function(AppState) {
  var _this = this;
  var SelectTool = AppState.Tools.select;
  this.setMoveListeners(AppState);
  // If we wish to use the BaseShape mouse events as well, use bind the events to
  // the graphics object first
  //var mousedown = this.graphics.mousedown.bind(this.graphics);
  //var mouseup = this.graphics.mouseup.bind(this.graphics);

  // this.graphics.mousedown = function(data) {
  //   // data.originalEvent.preventDefault();
  //   console.log('set Rect special mouse down');
  //   // mousedown(data);
  // };

  // Mouse handlers for highlighting shapes
  this.graphics.mouseover = function(data) {
    data.originalEvent.preventDefault();

    this.highlight(0x0000FF);
  }.bind(this);//mouseover.bind(_this);

  this.graphics.mouseout = function(data) {
    data.originalEvent.preventDefault();

    // Unhighlight
    this.unHighlight();
  }.bind(this);//mouseout.bind(_this);
}




