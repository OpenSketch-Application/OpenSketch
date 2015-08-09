'use strict';
var PIXI = require('pixi');
var Table = require('../shapes/Table');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {

  // Mininum Table Col and Row
  var minRows = 2;
  var minCols = 2;
  var cellHeight = 30;
  var cellWidth = 65;
  var drawRows;
  var drawCols;
  var curCols;
  var curRows;

  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;
  var Tools = AppState.Tools;
  var isDown = false;
  var startPos;
  var table;

  el.addEventListener('click', function(data) {
    data.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    AppState.Tools.selected = 'table';

    console.log('Drawing table');

    activate(settings, AppState);

    return false;
  });

  var mousedown = function(data) {
    isDown = true;
    drawRows = curRows =  0;
    drawCols = curCols = 0;
    startPos = data.getLocalPosition(this);

    table = new Table(Tools.table);
    console.log('Mouse DOwn');
    console.dir(table);

    table.draw({
      x: startPos.x,
      y: startPos.y
    });
    //   x: startPos.x,
    //   y: startPos.y,
    //   cellWidth: cellWidth,
    //   cellHeight: cellHeight,
    //   rows: drawRows,
    //   cols: drawCols
    // });
  };

  var mousemove = function(data) {

    // if(isDown) {
    //   var curPos = data.getLocalPosition(this);
    //   var width = curPos.x - startPos.x;
    //   var height = curPos.y - startPos.y;
    //   curCols = Math.ceil(width/cellWidth);
    //   curRows = Math.ceil(height/cellHeight);

    //   if(curCols <= 0 || curRows <= 0) {
    //     if(table) {
    //       drawCols = curCols;
    //       drawRows = curRows;
    //       shapes.removeShape(table);
    //       socket.emit(EVENT.shapeEvent, 'remove', table);
    //       table = null;
    //     }
    //   } else {

    //     if (curRows < minRows) curRows = minRows;
    //     if (curCols < minCols) curCols = minCols;

    //     if(curCols != drawCols || curRows != drawRows) {
    //       if(!table) {
    //         table = shapes.addNew(new Table(Tools.table));
    //         socket.emit(EVENT.shapeEvent, 'add', table.getProperties());
    //       }

    //       drawRows = curRows;
    //       drawCols = curCols;

    //       table.draw({
    //         x: startPos.x,
    //         y: startPos.y,
    //         cellWidth: cellWidth,
    //         cellHeight: cellHeight,
    //         rows: drawRows,
    //         cols: drawCols
    //       });

    //       table.highlight();
    //       socket.emit(EVENT.shapeEvent, 'draw', table.getProperties());
    //     }
    //   }
    // }
  };

  var mouseup = function(data) {
    if(isDown) {
      // table.setMoveListeners(AppState);
      // table.unHighlight();
      // socket.emit(EVENT.shapeEvent, 'drawEnd', table.getProperties());
      // socket.emit(EVENT.saveObject, table.getProperties());
      // table = null;
    }

    isDown = false;
  };

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseup;
  }
};

