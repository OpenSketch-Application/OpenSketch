'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Pencil;

function Pencil(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  BaseShape.call(this,shapeProperties);
  this.shapeType = 'pencil';

  this.setProperties(shapeProperties);
}

// Set prototype to the BaseShape
Pencil.prototype = Object.create(BaseShape.prototype);
Pencil.prototype.constructor = Pencil;

// Get Properties for Socket (Does not include graphics object)
Pencil.prototype.getProperties = function() {

  // Get Pencil properties
 var shape = BaseShape.prototype.getProperties.call(this);

  shape.path = this.path;
  shape.lineWidth= this.lineWidth;
  shape.lineColor= this.lineColor;
  shape.lineAlpha= this.lineAlpha;
  shape.shapeType= this.shapeType;

  return shape;
};

Pencil.prototype.setProperties = function(shapeProperties) {

  // Set Base properties by calling Base's set method
  BaseShape.prototype.setProperties.call(this, shapeProperties);


  this.path = shapeProperties.path;
  this.lineWidth = shapeProperties.lineWidth || 1; // if(shapeProperties.lineWidth)
  this.lineColor = shapeProperties.lineColor || 0x000000; // if(shapeProperties.lineColor)
  this.lineAlpha = shapeProperties.lineAlpha || 1; // if(shapeProperties.lineAlpha)

  // Set Style properties to the internal Graphics object
  this.graphics.lineWidth = this.lineWidth;
  this.graphics.lineColor = this.lineColor;
  this.graphics.lineAlpha = this.lineAlpha;
  this.graphics.alpha = this.lineAlpha;
};

Pencil.prototype.draw = function(shapeProperties) {
  //console.log('calling draw')
  this.graphics.clear();
  this.graphics.interactive = false;

  if(shapeProperties.path) this.path = shapeProperties.path;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again

  this.graphics.lineWidth = shapeProperties.lineWidth ? this.lineWidth = shapeProperties.lineWidth
                                                      : this.lineWidth;

  this.graphics.lineColor = shapeProperties.lineColor ? this.lineColor = shapeProperties.lineColor
                                                      : this.lineColor;
  this.graphics.lineAlpha = shapeProperties.lineAlpha ? this.lineAlpha = shapeProperties.lineAlpha
                                                      : this.lineAlpha;

  // Redraw the shape
  this.graphics.drawPolygon(
    this.path
  );


  return this;
};

// To keep track of the number of shapes of this type
Pencil.prototype.shapeCount = 0;


Pencil.prototype.getGraphicsData = function() {
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

Pencil.prototype.setGraphicsData = function(shapeProperties) {
  var graphicsData = this.graphics.graphicsData[0];

  graphicsData.lineWidth = this.lineWidth = (shapeProperties.lineWidth || this.lineWidth);
  graphicsData.lineColor = this.lineColor = (shapeProperties.lineColor || this.lineColor);
  graphicsData.lineAlpha = this.lineAlpha = (shapeProperties.lineAlpha || this.lineAlpha);

}









