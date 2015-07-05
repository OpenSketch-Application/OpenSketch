var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Vector = require('matter-js').Vector;

module.exports = Line;

function Line(shapeProperties) {
  BaseShape.call(this, shapeProperties);

  this.objectType = 'line';

  this.setProperties(shapeProperties);
}

// Set prototype to the BaseShape
// subclass extends superclass
Line.prototype = Object.create(BaseShape.prototype);
Line.prototype.constructor = Line;

function setEventListeners(AppState) {
  console.log('setting line mouse listeners');
  console.log('Vector', this);
  this.interactive = true;
  var Tools = AppState.Tools;
  // Set the hit area for interaction
  var width = this.x2 - this.x;
  var height = this.y2 - this.y;

  // Draw selectable points on shape
  // for line we need only two, on point x,y and x2,y2
  // width, height should default to lineWidth + 2;
  // don't set hit listeners for these ones
  // Use rectangle contains to calculate it from main hit area

  this.graphics.mouseover = function(data) {
    data.originalEvent.preventDefault();

    if(Tools.selected === 'select' && !this.selected) {
      // Highlight Shape outline
      this.highlight(0x0000FF);
    }

  }.bind(this);//mouseover.bind(_this);

  this.graphics.mouseout = function(data) {
    data.originalEvent.preventDefault();

    if(Tools.selected === 'select' && !this.selected) {
      // Unhighlight
      this.unHighlight();
    }

  }.bind(this);

}

Object.defineProperties(Line.prototype, {
  setProperties: {
    value: function(shapeProperties) {
      console.log('calling line set properties');
      // Set Base properties by calling Base's set method
      BaseShape.prototype.setProperties.call(this, shapeProperties);

      this.x = shapeProperties.x || 0;
      this.y = shapeProperties.y || 0;
      this.x2 = shapeProperties.x2 || 0;
      this.y2 = shapeProperties.y2 || 0;

      this.lineWidth = shapeProperties.lineWidth || 1;
      this.lineColor = shapeProperties.lineColor || 0;
      this.lineAlpha = shapeProperties.lineAlpha || 1;
    }
  },
  x2: {
    get: function() {
      return this._x2;
    },
    set: function(x2) {
      this._x2 = x2;
    }
  },
  y2: {
    get: function() {
      return this._y2;
    },
    set: function(y2) {
      this._y2 = y2;
    }
  },
  lineWidth: {
    get: function() {
      return this._lineWidth;
    },
    set: function(lineWidth) {
      this.graphics.lineWidth = this._lineWidth = lineWidth;
    }
  },
  lineColor: {
    get: function() {
      return this._lineColor;
    },
    set: function(lineColor) {
      this._lineColor = this.graphics.lineColor = lineColor;
    }
  },
  lineAlpha: {
    get: function() {
      return this._lineAlpha;
    },
    set: function(lineAlpha) {
      if(this.graphicsData && lineAlpha)
        this._lineAlpha = this.graphicsData[0].lineAlpha = 1;
    }
  },
  interactive: {
    get: function() {
      return this._interactive;
    },
    set: function(isInteractive) {
      this._interactive = this.graphics.interactive = isInteractive;
    }
  },
  draw: {
    value: function(shapeProperties) {
      this.graphics.clear();
      this.interactive = false;
      if(shapeProperties.x) this.x = shapeProperties.x;
      if(shapeProperties.y) this.y = shapeProperties.y;
      if(shapeProperties.x2) this.x2 = shapeProperties.x2;
      if(shapeProperties.y2) this.y2 = shapeProperties.y2;

      // Since we cleared the style properties, we need to reset them again
      this.lineWidth = shapeProperties.lineWidth || this.lineWidth;
      this.lineColor = shapeProperties.lineColor || this.lineColor;

      //this.graphics.lineWidth = 1;
      console.log('shapeProperties lineWidth', shapeProperties.lineWidth, this.lineWidth);
      this.graphics.moveTo(this.x, this.y);
      this.graphics.lineTo(this.x2, this.y2);
      this.drawSelectablePoints(this.x, this.y, this.x2, this.y2);
    }
  },
  setEventListeners: {
    value: setEventListeners
  },
  highlight: {
    value: function(color) {
      this.highlightShape.clear();

      this.highlightShape.lineWidth = this.lineWidth + 2;
      this.highlightShape.lineColor = 0x2D8EF0;
      //this.highlightShape.lineColor = color || 0x0000FF;
      this.highlightShape.alpha = 1;

      this.highlightShape.moveTo(this.x, this.y);
      this.highlightShape.lineTo(this.x2, this.y2);
      // this.highlightShape.drawRect(
      //   this.x,
      //   this.y,
      //   this.width,
      //   this.height
      // );

      this.graphics.addChildAt(this.highlightShape, 0);
    }
  },
  unHighlight: {
    value: function() {
      this.highlightShape.clear();
    }
  },
  drawSelectablePoints: {
    value: function(x,y,x2,y2) {
      var container = this.graphics;
      // Store current style
      var lineWidth = container.lineWidth;
      var len = ((lineWidth + 5)/2);

      // var vertices = [
      //   // x,y, x,y, x,y, x,y
      //   this.x, this.y - len,
      //   this.x + len, this.y,
      //   this.x, this.y + len,
      //   this.x - len, this.y
      // ];

      x -= len;
      y -= len;
      x2 -= len;
      y2 -= len;

      len = len*2;

      container.beginFill(0);

      container.drawRect(x, y, len, len);
      container.drawRect(x2, y2, len, len);

      // Set lineWidth back to normal for this graphics object
      container.lineWidth = this.lineWidth;
    }
  }
});

// var unHighlight =
// function(fillColor, fillAlpha, lineAlpha, lineColor, lineWidth, shape)

// APP_STATE.Canvas.stage.children[0].updateLineStyle(0xFF0000, 1, 0.4, 0xFFFFFF, 10, { x: 200, y: 150, width: 200, height: 300 })
PIXI.Graphics.prototype.updateRectangleStyles = function(fillColor, fillAlpha, lineAlpha, lineColor, lineWidth, shape)
{
  var len = this.graphicsData.length;
  for (var i = 0; i < len; i++) {
    var data = this.graphicsData[i];

    if(data.fillColor && fillColor)
      data._fillTint = fillColor = fillColor;
    if(data.fillAlpha && fillAlpha)
      data.fillAlpha = fillAlpha;
    if(data.fillColor && fillColor)
      data.fillColor = fillColor;
    if(data.lineAlpha && lineAlpha)
      data.lineAlpha = lineAlpha;
    if(data.lineColor && lineColor)
      data.lineColor = data._lineTint = lineColor;
    if(data.lineWidth && lineWidth)
      data.lineWidth = lineWidth;
    if(data.shape && shape) {
      data.shape.height = shape.height;
      data.shape.width = shape.width;
      data.shape.x = shape.x;
      data.shape.y = shape.y;
    }

    this.dirty = true;
    this.clearDirty = true;
  }
};
