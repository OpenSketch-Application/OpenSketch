'use strict';
var PIXI = require('pixi');
var Line = require('../shapes/Line');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(el, AppState) {
  var isDown = false;
  var originalPoint;
  var drawBegan = false;

  var lineSettings = AppState.Tools.line
  var line;
  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;

  el.addEventListener('click', function(data) {
    data.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    console.log('Selected Line Tool...');

    AppState.Tools.selected = 'line';

    //Line.set(settings.stage, settings.renderer);
    activate();

    return false;
  });

  function mousedown(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    originalPoint = data.getLocalPosition(this);

    line = new Line(lineSettings);

  };

  function mousemove(data) {
    if(isDown) {
      var currentPoint = data.getLocalPosition(this);
      //console.log('line mouse move: ', line);
      line.draw({
        x: originalPoint.x,
        y: originalPoint.y,
        x2: currentPoint.x,
        y2: currentPoint.y
      });

      line.drawSelectablePoints(
        originalPoint.x, originalPoint.y,
        currentPoint.x, currentPoint.y
      );

      //SocketObject.emitDrawingObject(graphics);
      if(drawBegan) {
        // Emite socket draw event
        socket.emit(EVENT.shapeEvent, 'draw', line.getProperties());
      }
      else {
        // Add line to Shapes container
        line = shapes.addNew(line);

        // Emit socket add shape event
        socket.emit(EVENT.shapeEvent, 'add', line.getProperties());

        AppState.ToolBar.currentlyDrawingShape = line;
      }
      drawBegan = true;
    }
  };

  function mouseup(data) {
    if(isDown) {
      if(drawBegan) {
        line.setEventListeners(AppState);

        line.unHighlight();

        // Emit socket event
        socket.emit(EVENT.shapeEvent, 'drawEnd', line.getProperties());
        socket.emit(EVENT.saveObject, line.getProperties());

        AppState.ToolBar.currentlyDrawingShape = undefined;
      }
      else {
        shapes.removeShape(line);

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        socket.emit(EVENT.removeShape, line._id, function(err) {
          if(err) {
            console.error(err);
          } else {
            AppState.Canvas.Shapes.removeShapeByID(line._id);
          }
        });
      }
    }
    drawBegan = isDown = false;
  };

  function activate() {
    stage.mousedown = mousedown;
    stage.mouseup = mouseup;
    stage.mousemove = mousemove;
    stage.mouseout = mouseup;
  }
};
