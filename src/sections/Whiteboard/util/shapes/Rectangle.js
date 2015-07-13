'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');

module.exports = Rectangle;

function Rectangle(shapeProperties) {
  // Call BaseShape constructor to instantiate BaseShape's properties
  BaseShape.call(this, shapeProperties);

  this.shapeType = 'rectangle';

  // Invoke Derived Class's setProperties method to add all shapeProperties to
  // this object
  this.setProperties(shapeProperties);
}

// Set prototype to the BaseShape
Rectangle.prototype = Object.create(BaseShape.prototype);

// Ensure constructor points to Derived Class and not its BaseShape
Rectangle.prototype.constructor = Rectangle;

// Get Properties for Socket (Does not include graphics object)
Rectangle.prototype.getProperties = function() {
  // Get the BaseShape's properties and attach its properties to temporary our
  // shape object that we will return
  var shape = BaseShape.prototype.getProperties.call(this);

  // Attach Derived's properties to the shapeProperties object we wish to return
  shape.x = this.x;
  shape.y = this.y;
  shape.shapeType = this.shapeType;
  shape.width = this.width;
  shape.height = this.height;
  shape.lineWidth = this.lineWidth;
  shape.lineColor = this.lineColor;
  shape.fillColor = this.fillColor;
  shape.lineAlpha = this.lineAlpha;
  shape.fillAlpha = this.fillAlph;

  return shape;
};

// Set the Dervied's properties, this is seperate from the BaseShape's setProperties
Rectangle.prototype.setProperties = function(shapeProperties) {

  // Set BaseShape's properties by calling BaseShape's set method
  BaseShape.prototype.setProperties.call(this, shapeProperties);

  if(shapeProperties.x) this.x = shapeProperties.x || 0;
  if(shapeProperties.y) this.y = shapeProperties.y || 0;

  if(shapeProperties.width) this.width = shapeProperties.width || 0;
  if(shapeProperties.height) this.height = shapeProperties.height || 0;

  this.lineWidth = shapeProperties.lineWidth || 1;
  this.lineColor = shapeProperties.lineColor || 0x000000;
  this.fillColor = shapeProperties.fillColor || 0xFFFFFF;
  this.lineAlpha = shapeProperties.lineAlpha || 1;
  this.fillAlpha = Number.parseFloat(shapeProperties.fillAlpha || 1);

  // Set Style properties to the internal Graphics object
  this.graphics.lineWidth = this.lineWidth;
  this.graphics.lineColor = this.lineColor;
  this.graphics.fillColor = this.fillColor;
  this.graphics.lineAlpha = this.lineAlpha;
  this.graphics.fillAlpha = this.fillAlpha;
  this.graphics.alpha = this.fillAlpha;
};

// Draw method can be used when attempting to constantly resize or when User is attempting to
// resize or change the properties
// Whenever you wish to change graphics properties of Shape, ie. lineWidth, width or height,
// call this method with the new properties you wish to update the Shape with;
Rectangle.prototype.draw = function(shapeProperties) {

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
  this.graphics.drawRect(
    this.x,
    this.y,
    this.width,
    this.height
  );

  this.graphics.endFill();

  return this;
};

/*
  Will be used later if we wish to access the actual graphics data object
 */
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

/*
  Will be used later if we wish to access the actual graphics data object
 */
Rectangle.prototype.setGraphicsData = function(shapeProperties) {

  var graphicsData = this.graphics.graphicsData[0];

  graphicsData.lineWidth = this.lineWidth = (shapeProperties.lineWidth || this.lineWidth);
  graphicsData.lineColor = this.lineColor = (shapeProperties.lineColor || this.lineColor);
  graphicsData.lineAlpha = this.lineAlpha = (shapeProperties.lineAlpha || this.lineAlpha);
  graphicsData.fillAlpha = this.fillAlpha = (shapeProperties.fillAlpha || this.fillAlpha);
  graphicsData.fillColor = this.fillColor = (shapeProperties.fillColor || this.fillColor);

  // Ensure renderer knows that this Graphics Object needs to be rendered
  this.graphics.dirty = true;
  this.graphics.clearDirty = true;
}

// Highlights the Shape
Rectangle.prototype.highlight = function(color) {

  this.highlightShape.clear();
  this.highlightShape.lineWidth = this.lineWidth + 2;
  this.highlightShape.lineColor = color || 0x2D8EF0;
  this.highlightShape.alpha = 1;

  this.highlightShape.drawRect(
    this.x,
    this.y,
    this.width,
    this.height
  );
}

// Unhighlights the shape
Rectangle.prototype.unHighlight = function() {
  this.highlightShape.clear();
}

// Sets the Listeners for Mouse and potentially Keyboard events
// NOTE: always ensure graphics object interactivity is set to true
// else the listeners will not be activated
Rectangle.prototype.setMoveListeners = function(AppState) {

  var Tools = AppState.Tools;

  // Call BaseShape's setMoveListeners
  BaseShape.prototype.setMoveListeners.call(this, AppState);

  // If we wish to keep the BaseShape's mouse events, bind the mouse events
  // of the graphics object and store the bound mouse event handlers in this scope

  //var baseMouseDown = this.graphics.mousedown.bind(this.graphics);
  //var baseMouseUp = this.graphics.mouseup.bind(this.graphics);

  // Then override the graphic's objects methods, and implement your own, then invoke the
  // stored methods inside your event handler methods
  // this.graphics.mouseover = function(data) {
  //   // Invoking base's handler
  //   baseMouseDown(data);
  //
  //   // Then invoke your derived's event handling logic
  //   // here
  // }

  // Mouse handlers for highlighting shapes
  this.graphics.mouseover = function(data) {

    if(Tools.selected === 'select' && !this.selected) {
      // Highlight Shape outline
      this.highlight();
    }

  }.bind(this);//mouseover.bind(_this);

  this.graphics.mouseout = function(data) {

    if(Tools.selected === 'select' && !this.selected) {
      // Unhighlight
      this.unHighlight();
    }

  }.bind(this);
}




