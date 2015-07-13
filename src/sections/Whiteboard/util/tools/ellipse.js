'use strict';
var PIXI = require('pixi');
var Ellipse = require('../shapes/Ellipse');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(el, AppState) {
  console.log('AppState', AppState);
  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;
  var Tools = AppState.Tools;
  var isDown = false;
  var drawBegan = false;
  var ellipse;
  var originalCoords;

  el.addEventListener('click', function(data) {
    data.preventDefault();
    console.log('Selected shapes...');

    // Set the selected tool on AppState
    AppState.Tools.selected = 'ellipse';

    activate(AppState);
  });

  var mousedown = function(data) {
    //data.originalEvent.preventDefault();
    isDown = true;

    originalCoords = data.getLocalPosition(this);


    ellipse = new Ellipse(Tools.ellipse);
  };

  var mousemove = function(data) {
    //data.originalEvent.preventDefault();
    if(isDown) {
      data.originalEvent.preventDefault();
      var localPos = data.getLocalPosition(this);
      var topX = 0;
      var topY = 0;
      var width = localPos.x - originalCoords.x;
      var height = localPos.y - originalCoords.y;

      // Ensure height and width are positive
      if(width < 0) width *= -1;
      if(height < 0) height *= -1;

      topX = Math.min(originalCoords.x, localPos.x);
      topY = Math.min(localPos.y, originalCoords.y);

      ellipse.draw({
        x: topX,
        y: topY,
        width: width,
        height: height
      });

      ellipse.highlight();

      if(drawBegan) {
        // Draw event by default lock shape, since this Event manipulates
        // a Shape dimensions and other Users should not change its properties
        // during drawing
        socket.emit(EVENT.shapeEvent, 'draw', ellipse.getProperties());
      }
      else {
        // Adds shape to the shapes object/container and stage
        ellipse = shapes.addNew(ellipse);
        socket.emit(EVENT.shapeEvent, 'add', ellipse.getProperties());
      }

      drawBegan = true;
    }
  };

  var mouseup = function(data) {
    //data.originalEvent.preventDefault();

    if(isDown) {
      if(drawBegan) {
        ellipse.setShapeMoveListeners(AppState);

        ellipse.unHighlight();
        socket.emit(EVENT.shapeEvent, 'drawEnd', ellipse.getProperties());
        // Emit socket save Event, since drawing has ended on mouse up
        // and User has finished saving Shape Object
        //socket.emit(EVENT.saveObject, ellipse.getProperties());
      }
      else {
        // Remove Shape from Shapes hashmap
        shapes.removeShape(ellipse);

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        //socket.emit(EVENT.shapeEvent, 'remove', ellipse._id);
      }
    }

    isDown = drawBegan = false;
  };

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseup;
  }

};

