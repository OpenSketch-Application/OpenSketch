'use strict';
var PIXI = require('pixi');
var Line = require('../shapes/Line');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(settings, el, AppState) {
  var isDown = false;
  var originalPoint;
  var drawBegan = false;

  var lineSettings = AppState.Tools.line
  var line;
  var stage = settings.stage;
  var renderer = settings.renderer;
  var shapes = AppState.Canvas.Shapes;

  el.addEventListener('click', function(data) {
    console.log('Selected Line Tool...');
    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked
    AppState.Tools.selected = 'line';

    //Line.set(settings.stage, settings.renderer);
    activate();
  });

  function mousedown(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    originalPoint = data.getLocalPosition(this);

    line = new Line(lineSettings);

    console.log("line mouse down", AppState);
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

      //SocketObject.emitDrawingObject(graphics);
      if(drawBegan) {
        // Emite socket draw event
      }
      else {
        // Add line to Shapes container
        line = shapes.addNew(line);

        // Emit socket add shape event
      }
      drawBegan = true;
    }
  };

  function mouseup(data) {
    if(isDown) {
      if(drawBegan) {
        console.log('line mouseup, draw began');
        line.setEventListeners(AppState);

        // Emit socket event
      }
      else {
        console.log('line mouseup, draw not began');

        shapes.removeShape(line);

        // Emit socket remove event
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
