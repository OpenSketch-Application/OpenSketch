'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Textbox = require('./Text');
module.exports = Table;

function Table(shapeProperties) {
  BaseShape.call(this, shapeProperties);
  this.shapeType = 'table';

  BaseShape.prototype.setProperties.call(this, shapeProperties);

  if(shapeProperties.x) this.x = shapeProperties.x || 0;
  if(shapeProperties.y) this.y = shapeProperties.y || 0;

  if(shapeProperties.width) this.width = shapeProperties.width || 0;
  if(shapeProperties.height) this.height = shapeProperties.height || 0;
  if(shapeProperties.cols) this.cols = shapeProperties.cols || 2;
  if(shapeProperties.rows) this.rows = shapeProperties.rows || 2;

  this.lineWidth = shapeProperties.lineWidth || 1;
  this.lineColor = shapeProperties.lineColor || 0x000000;
  this.fillColor = shapeProperties.fillColor || 0xFFFFFF;
  this.lineAlpha = shapeProperties.lineAlpha || 1;
  this.fillAlpha = Number.parseFloat(shapeProperties.fillAlpha || 1);
  this.cellTextStyle = shapeProperties.cellTextStyle;

  // Set Style properties to the internal Graphics object
  this.graphics.lineWidth = this.lineWidth;
  this.graphics.lineColor = this.lineColor;
  this.graphics.fillColor = this.fillColor;
  this.graphics.lineAlpha = this.lineAlpha;
  this.graphics.fillAlpha = this.fillAlpha;
  this.graphics.alpha = this.fillAlpha;

  var tempCell;

  if(shapeProperties.children && shapeProperties.children.length > 0) {
    this.children = shapeProperties.children.map(function(cell) {
      tempCell = new Textbox(cell.shapeProperties);
      this.graphics.addChild(tempCell.getGraphics());
      return tempCell;
    });
  }
  else {
    this.children = [];
    for(var r = 0; r < this.rows; r++) {
      for(var c = 0; c < this.cols; c++) {
        tempCell = new Textbox(this.cellTextStyle);
        this.graphics.addChild(tempCell.getGraphics());
        this.children.push(tempCell);
      }
    }
  }
}

Table.prototype = Object.create(BaseShape.prototype);

Table.prototype.constructor = Table;

Table.prototype.getProperties = function() {
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
  shape.fillAlpha = this.fillAlpha;
  shape.cell = this.cell;
  shape.rows = this.rows;
  shape.cols = this.cols;
  shape.headerStyle = this.headerStyle;

  shape.children = this.children.map(function(cell) {
    return cell.getProperties();
  });

  return shape;
};

Table.prototype.setProperties = function(shapeProperties) {

  BaseShape.prototype.setProperties.call(this, shapeProperties);

  if(shapeProperties.x) this.x = shapeProperties.x || 0;
  if(shapeProperties.y) this.y = shapeProperties.y || 0;

  if(shapeProperties.width) this.width = shapeProperties.width || 0;
  if(shapeProperties.height) this.height = shapeProperties.height || 0;
  if(shapeProperties.cols) this.cols = shapeProperties.cols || 2;
  if(shapeProperties.rows) this.rows = shapeProperties.rows || 2;
  if(shapeProperties.cellTextStyle) this.cellTextStyle = shapeProperties.cellTextStyle;
  if(shapeProperties.headerStyle) this.headerStyle = shapeProperties.headerStyle;

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

  var tempCell;

  if(shapeProperties.children && shapeProperties.children.length > 0) {
    this.children = shapeProperties.children.map(function(cell) {
      tempCell = new Textbox(cell.shapeProperties);
      this.graphics.addChild(tempCell.getGraphics());
      return tempCell;
    });
  }
  else {
    this.children = [];
  }
}

Table.prototype.draw = function(shapeProperties) {

  this.graphics.clear();
  this.graphics.interactive = false;

  if(shapeProperties.x) this.x = shapeProperties.x;
  if(shapeProperties.y) this.y = shapeProperties.y;
  //if(shapeProperties.cellWidth) this.cell.width = shapeProperties.cellWidth;
  //if(shapeProperties.cellHeight) this.cell.height = shapeProperties.cellHeight;
  if(shapeProperties.rows) this.rows = shapeProperties.rows;
  if(shapeProperties.cols) this.cols = shapeProperties.cols;
  // this.width = this.cols*this.cell.width;
  // this.height = this.rows*this.cell.height;

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
  //this.graphics.beginFill(this.fillColor);


  // if(this.children && this.children.length > 0) {
  //   this.children.forEach(function(cell) {
  //     var shapeProperties = {
  //       x: originalCoords.x,
  //       y: originalCoords.y,
  //       width: textbox.width,
  //       height: textbox.height
  //     }
  //     cell.draw({
  //       x: this.x
  //     });
  //   })
  // }

  // this.graphics.drawRect(this.x, this.y, this.width, this.height);
  // this.graphics.lineStyle(1, 0x000000);
  // else if(shapeProperties.children && shapeProperties.children.length > 0){
  for(var i = this.cols-1; i >= 0; i--) {
    for(var j = this.rows-1; j >= 0; j--) {
      // Header row style
      // if(j === 0) {
      //   this.graphics.beginFill(0x8DCFDE);
      // } else {
      //   this.graphics.beginFill(0xFFFFFF);
      // }

      var shapeProperties = {
        x: this.x + i*this.children[i+j].width,
        y: this.y + j*this.children[i+j].height,
        width: this.children[i+j].width,
        height: this.children[i+j].height
      }



      this.children[i+j].draw(shapeProperties);
    }
  }
  // }

  //this.graphics.endFill();

  return this;
};

Table.prototype.getGraphicsData = function() {

  var graphicsData = this.graphics.graphicsData[0];

  var graphics = {
    lineWidth: graphicsData.lineWidth,
    lineColor: graphicsData.lineColor,
    lineAlpha: graphicsData.lineAlpha,
    fillAlpha: graphicsData.fillAlpha,
    fillColor: graphicsData.fillColor
  };

  return graphics;
};

Table.prototype.getWidestCellColumns = function (cells) {
    var cellWidths = cells[0].map(function(column, index) {

        return cells.reduce(function(prevCell, curRow) {
            if(prevCell && prevCell[index]) prevCell = prevCell[index];
            return curRow[index].width > prevCell.width
                                       ? curRow[index]
                                       : prevCell;
        });
    });

    return cellWidths.sort(function(a,b) {
        return a.width - b.width;
    });
}

Table.prototype.getHighestCellRows = function(cells) {
    return cells.map(function(row) {
        return row.reduce(function(prev, curr) {
            return prev.height > curr.height
                               ? prev
                               : curr;
        })
    }).sort(function(a,b) {
        return a.height - b.height;
    })
}
/*
  Will be used later if we wish to access the actual graphics data object
 */
Table.prototype.setGraphicsData = function(shapeProperties) {

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
Table.prototype.highlight = function(color) {

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
Table.prototype.unHighlight = function() {
  this.highlightShape.clear();
}

// Sets the Listeners for Mouse and potentially Keyboard events
// NOTE: always ensure graphics object interactivity is set to true
// else the listeners will not be activated
Table.prototype.setMoveListeners = function(AppState) {

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
    if(this.locked) return;
    if(Tools.selected === 'select' && !this.selected) {
      // Highlight Shape outline
      this.highlight();
    }

  }.bind(this);//mouseover.bind(_this);

  this.graphics.mouseout = function(data) {
    if(this.locked) return;
    if(Tools.selected === 'select' && !this.selected) {
      // Unhighlight
      this.unHighlight();
    }

  }.bind(this);
}
