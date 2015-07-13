'use strict';
var PIXI = require('pixi');
var Rectangle = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {
  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;
  var Tools = AppState.Tools;
  var isDown = false;
  var drawBegan = false;
  var rect;
  var originalCoords;

  el.addEventListener('click', function(data) {
    data.preventDefault();

    // Set the selected tool on AppState
    AppState.Tools.selected = 'rectangle';

    activate(settings, AppState);
  });

  var mousedown = function(data) {
    isDown = true;
    //data.originalEvent.preventDefault();
    originalCoords = data.getLocalPosition(this);

    rect = new Rectangle(Tools.rectangle);
  };

  var mousemove = function(data) {
    if(isDown) {
      //data.originalEvent.preventDefault();
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

      rect.draw({
        x: topX,
        y: topY,
        width: width,
        height: height
      });

      //console.log(rect);
      rect.highlight();

      if(drawBegan) {
        console.log('Draw Began, emit shape', rect.getProperties());
        socket.emit(EVENT.shapeEvent, 'draw', rect.getProperties());
      }
      else {
        // Adds shape to the shapes object/container and stage
        rect = shapes.addNew(rect);

        var RectProp = rect.getProperties();
        // Send socket info since drawing has began now
        console.log('ADDING as new Rect', RectProp);
        console.log('Socket', socket);
        socket.emit(EVENT.shapeEvent, 'add', RectProp);

      }

      drawBegan = true;
    }
  };

  var mouseup = function(data) {
    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      // Check if Shape was actually drawn, ie. did user press mouse down and mouse move, which draws a Shape, or
      // just simply press mouse down, which is not considered drawing
      if(drawBegan) {

        rect.setMoveListeners(AppState);

        rect.unHighlight();

        // Emit socket drawEnd Event, since drawing has ended on mouse up
        //socket.emit(EVENT.shapeEvent, 'drawEnd', rect._id);
        socket.emit(EVENT.saveObject, rect.getProperties());
      }
      else {
        // We always add a Shape Id to hash on
        shapes.removeShape(rect);

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        socket.emit(EVENT.shapeEvent, 'remove', rect._id);
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

