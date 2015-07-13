'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Ellipse;

function Ellipse(shapeProperties) {
  BaseShape.call(this, shapeProperties);
  //this.graphics = new PIXI.Graphics();
  //this.highlightShape = new PIXI.Graphics();
  //this.graphics.addChild(this.highlightShape);
  this.shapeType = 'ellipse';

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

  this.setProperties(shapeProperties);
}

// Set prototype to the BaseShape
Ellipse.prototype = Object.create(BaseShape.prototype);
Ellipse.prototype.constructor = Ellipse;

// Get Properties for Socket (Does not include graphics object)
Ellipse.prototype.getProperties = function() {

  // Get the base properties and attach base properties to temporary our shape object
  var shape = BaseShape.prototype.getProperties.call(this);

  // Get Ellipse properties

  shape.x = this.x;
  shape.y = this.y;
  shape.width = this.width;
  shape.height = this.height;
  shape.lineWidth = this.lineWidth;
  shape.lineColor = this.lineColor;
  shape.fillColor = this.fillColor;
  shape.lineAlpha = this.lineAlpha;
  shape.fillAlpha = this.fillAlpha;
  shape.shapeType = this.shapeType;

  return shape;
};

Ellipse.prototype.setProperties = function(shapeProperties) {

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
  this.graphics.alpha = this.fillAlpha;
};

Ellipse.prototype.draw = function(shapeProperties) {
  //console.log('calling draw')
  this.graphics.clear();
  this.graphics.interactive = false;

  if(shapeProperties.x) this.x = shapeProperties.x;
  if(shapeProperties.y) this.y = shapeProperties.y;
  if(shapeProperties.width) this.width = shapeProperties.width;
  if(shapeProperties.height) this.height = shapeProperties.height;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again
  this.graphics.lineWidth = shapeProperties.lineWidth ? this.lineWidth = shapeProperties.lineWidth
                                                      : this.lineWidth;

  this.graphics.lineColor = shapeProperties.lineColor ? this.lineColor = shapeProperties.lineColor
                                                      : this.lineColor;
  this.graphics.lineAlpha = shapeProperties.lineAlpha ? this.lineAlpha = shapeProperties.lineAlpha
                                                      : this.lineAlpha;

  this.graphics.fillAlpha = shapeProperties.fillAlpha ? this.fillAlpha = shapeProperties.fillAlpha
                                                      : this.fillAlpha;
  this.graphics.fillColor = shapeProperties.fillColor ? this.fillColor = shapeProperties.fillColor
                                                      : this.fillColor;

  this.graphics.beginFill(this.fillColor);

  // Redraw the shape
  this.graphics.drawEllipse(
    this.x,
    this.y,
    this.width,
    this.height
  );

  this.graphics.endFill();

  return this;
};

//Ellipse.prototype.update = function(shapeProperties) {}

// Ellipse.prototype.move = function(x, y) {
//   this.graphics.position.x = x;
//   this.graphics.position.y = y;
// };

// To keep track of the number of shapes of this type
Ellipse.prototype.shapeCount = 0;

Ellipse.prototype.getGraphicsData = function() {
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

Ellipse.prototype.setGraphicsData = function(shapeProperties) {
  var graphicsData = this.graphics.graphicsData[0];

  graphicsData.lineWidth = this.lineWidth = (shapeProperties.lineWidth || this.lineWidth);
  graphicsData.lineColor = this.lineColor = (shapeProperties.lineColor || this.lineColor);
  graphicsData.lineAlpha = this.lineAlpha = (shapeProperties.lineAlpha || this.lineAlpha);
  graphicsData.fillAlpha = this.fillAlpha = (shapeProperties.fillAlpha || this.fillAlpha);
  graphicsData.fillColor = this.fillColor = (shapeProperties.fillColor || this.fillColor);

}

Ellipse.prototype.highlight = function(color) {
  this.highlightShape.clear();
  this.highlightShape.lineWidth = this.lineWidth + 2;
  this.highlightShape.lineColor = color || 0x2D8EF0;
  //this.highlightShape.lineColor = color || 0x0000FF;
  this.highlightShape.alpha = 1;

  this.highlightShape.drawEllipse(
    this.x,
    this.y,
    this.width,
    this.height
  );

  this.graphics.addChildAt(this.highlightShape, 0);
}

Ellipse.prototype.unHighlight = function() {
  this.highlightShape.clear();
}

Ellipse.prototype.setShapeMoveListeners = function(AppState) {
  var _this = this;
  var Tools = AppState.Tools;
  this.setMoveListeners(AppState);
  //this.graphics.interactive = true;
  // If we wish to use the BaseShape mouse events as well, use bind the events to
  // the graphics object first
  //var mousedown = this.graphics.mousedown.bind(this.graphics);
  //var mouseup = this.graphics.mouseup.bind(this.graphics);

  // Mouse handlers for highlighting shapes
  this.graphics.mouseover = function(data) {
    data.originalEvent.preventDefault();
    if(this.locked) return;
    if(Tools.selected === 'select' && !_this.selected) {
      // Highlight Shape outline
      this.highlight(0x0000FF);
    }

  }.bind(this);//mouseover.bind(_this);

  this.graphics.mouseout = function(data) {
    data.originalEvent.preventDefault();
    if(this.locked) return;
    if(Tools.selected === 'select' && !_this.selected) {
      // Unhighlight
      this.unHighlight();
    }

  }.bind(this);//mouseout.bind(_this);
}




