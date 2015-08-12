'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var TableCell = require('./TableCell');
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

  this.cellDefaults = shapeProperties.cellDefaults;
  this.cells = [];

  this.rowHeights = [];
  this.colWidths = [];

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

  shape.cells = this.cells.map(function(row) {
    return row.map(function(col) {
      return col;
    });
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



  // if(shapeProperties.children && shapeProperties.children.length > 0) {
  //   this.children = shapeProperties.children.map(function(cell) {
  //     tempCell = new TableCell(cell.shapeProperties);
  //     this.graphics.addChild(tempCell.getGraphics());
  //     return tempCell;
  //   });
  // }
  // else {
  //   this.children = [];
  // }
}

Table.prototype.draw = function(shapeProperties) {

  this.graphics.clear();
  this.graphics.interactive = false;
  if(shapeProperties) {
    if(shapeProperties.x) this.x = shapeProperties.x;
    if(shapeProperties.y) this.y = shapeProperties.y;
    //if(shapeProperties.cellWidth) this.cell.width = shapeProperties.cellWidth;
    //if(shapeProperties.cellHeight) this.cell.height = shapeProperties.cellHeight;
    if(shapeProperties.rows) this.rows = shapeProperties.rows;
    if(shapeProperties.cols) this.cols = shapeProperties.cols;
    if(shapeProperties.lineWidth) this.lineWidth = shapeProperties.lineWidth;
    if(shapeProperties.lineColor) this.lineColor = shapeProperties.lineColor;
    if(shapeProperties.lineAlpha) this.lineAlpha = shapeProperties.lineAlpha;
    if(shapeProperties.fillAlpha) this.fillAlpha = shapeProperties.fillAlpha;
    if(shapeProperties.fillColor) this.fillColor = shapeProperties.fillColor;
  }

  // this.width = this.cols*this.cell.width;
  // this.height = this.rows*this.cell.height;
  // this.graphics.x = this.x;
  // this.graphics.y = this.y;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again
  this.graphics.lineWidth =  this.lineWidth;

  this.graphics.lineColor = this.lineColor;// = shapeProperties.lineColor

  this.graphics.lineAlpha = this.lineAlpha;

  this.graphics.fillAlpha = this.fillAlpha;// = shapeProperties.fillAlpha

  this.graphics.fillColor = this.fillColor;

  //this.graphics.beginFill(this.fillColor);

  // this.rowHeights = [];
  // this.colWidths = [];

  // Generate rows
  for(var r = this.rows-1; r >= 0; r--) {
    this.cells[r] = [];

    if(this.rowHeights[r] === undefined) this.rowHeights[r] = 0;

    for(var c = this.cols-1; c >= 0; c--) {
      var cellAdded = false;
      if(this.colWidths[c] === undefined) this.colWidths[c] = 0;

      if(this.cells[r][c] === undefined)  {
        this.cells[r][c] = new TableCell(this.cellDefaults);
        cellAdded = true;
      }

      this.cells[r][c].parentContainer = this;

      if(cellAdded)  {
        this.graphics.addChild(this.cells[r][c].getGraphics());
      }

      if(this.rowHeights[r] < this.cells[r][c].height) {
        this.rowHeights[r] = this.cells[r][c].height;
      }
      if(this.colWidths[c] < this.cells[r][c].width) {
        this.colWidths[c] = this.cells[r][c].width;
      }

      this.cells[r][c].cellCoords = [r, c];
    }
  }

  // Calculate width/heights of row/cols and draw the cells
  for(r = this.rows-1; r >= 0; r--) {
    var widestSet = false;
    var highestSet = false;
    for(c = this.cols-1; c >= 0; c--) {
      this.cells[r][c].draw({
        x: this.x + c * this.cells[r][c].width,
        y: this.y + r * this.cells[r][c].height,
        width: this.colWidths[c],
        height: this.rowHeights[r]
      });

      this.cells[r][c].x = this.x + c * this.cells[r][c].width;
      this.cells[r][c].y = this.y + r * this.cells[r][c].height;

      // Set the max dimensions a cell can expand to before affecting other cells
      // in the table
      this.cells[r][c].maxWidth = this.colWidths[c];
      this.cells[r][c].maxHeight = this.colWidths[r];
      if(!widestSet && this.cells[r][c].width === this.colWidths[c]) {
        this.cells[r][c].widestCell = true;
        widestSet = true;
      }
      if(!highestSet && this.cells[r][c].height === this.rowHeights[r]) {
        this.cells[r][c].highestCell = false;
        highestSet = true;
      }
    }
  }

  this.height = this.rowHeights.reduce(function(sum, row) {
    return sum += row;
  }, 0);
  this.width = this.colWidths.reduce(function(sum, col) {
    return sum += col;
  }, 0);

  console.log(this.rowHeights);
  console.log(this.colWidths);

  console.log('Cell widths', this.getWidestCellColumns(this.cells));
  console.log('Cell heights', this.getHighestCellRows(this.cells));

  return this;
};

Table.prototype.reDraw = function(newDimensions, cellCoords) {
  var r = 0, c = 0;
  var maxR = this.rows;
  var maxC = this.cols;

  var widestCells = this.getWidestCellColumns(this.cells);
  var highestCells = this.getHighestCellRows(this.cells);
  debugger;
  // Width of Column needs to be changed
  if(newDimensions.xDiff !== 0){
    for(r = 0; r < maxR; r++) {
      for(c = cellCoords[1]; c < maxC; c++) {
        // Check if cell is widest in row
        if(widestCells.indexOf(this.cells[r][c]) !== -1) {
          this.cells[r][c].widestCell = true;
        }
        else {
          this.cells[r][c].widestCell = false;
        }

        if(r === cellCoords[0] && c === cellCoords[1]) continue;

        if(c !== cellCoords[1]) {
          this.cells[r][c].graphics.x = this.cells[r][c].graphics.x + newDimensions.xDiff;
        }
      }
    }
  }

  // Height of the row needs to be changed
  if(newDimensions.yDiff !== 0) {
    for(r = 0; r < maxR; r++) {
      for(c = cellCoords[1]; c < maxC; c++) {

        if(highestCells.indexOf(this.cells[r][c]) !== -1) {
          this.cells[r][c].highestCell = true;
        }
        else {
          this.cells[r][c].highestCell = false;
        }

        if(r === cellCoords[0] && c === cellCoords[1]) continue;

        if(r !== cellCoords[0]) {
          this.cells[r][c].graphics.y = this.cells[r][c].graphics.y + newDimensions.yDiff;
        }
      }
    }
  }

  widestCells = this.getWidestCellColumns(this.cells);
  highestCells = this.getHighestCellRows(this.cells);

  this.height = highestCells.reduce(function(sum, cell) {
    return sum += cell.height;
  }, 0);
  this.width = widestCells.reduce(function(sum, cell) {
    return sum += cell.width;
  }, 0);

  this.highlight();
}

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
  onResize:

  - getCurrentWidth
  - getCurrentHeight

 // Used for recalculating x,y of all remaining cells
 Get diffWidth
 Get diffHeight

 if width changed
    // check if current width > highest width for current column
    // change widestCell to current cell width

    // calculate x coordinates for all cells on this row
 if height changed
  // check if current height > highest height for current row
  // change highestCell to current highest cell

  // Calculate y coordinate for all cells
 */

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

  // Calculate width/heights of row/cols and draw the cells
  for(var r = this.rows-1; r >= 0; r--) {
    for(var c = this.cols-1; c >= 0; c--) {
      this.cells[r][c].setMoveListeners(AppState);
      //this.cells[r][c].graphics.mousemove = function() {};

    }
  }

  //this.graphics.mousedown = function(data) {
    // Get x,y of mouseclick
    // var localPos = data.getLocalPosition(this.graphics);
    // console.log(localPos);
    // var relativeCoords = {
    //   x: localPos.x - this.x,
    //   y: localPos.y - this.y
    // };

    // console.log(relativeCoords);
    // console.log('this.width', this.width, 'this.height', this.height);
    // var cellCoords = {
    //   row: Math.floor(relativeCoords.y/this.height * this.rows),
    //   col: Math.floor(relativeCoords.x/this.width * this.cols)
    // };

    //console.log(cellCoords);

    //this.cells[cellCoords.row][cellCoords.col].highlight();

    // this.cells[cellCoords.row][cellCoords.col].graphics.mousedown.call(
    //   this.cells[cellCoords.row][cellCoords.col].graphics,
    //   data
    // );

    //this.highlight();

  //}.bind(this);
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
