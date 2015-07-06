'use strict';
var PIXI = require('pixi');
var Rectangle = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {
  console.log('AppState', AppState);
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
    console.log('Selected shapes...');
    //if(settings.toolbar.toolSelected) return;
    //// Return early if toolbar Select was picked

    // Set the selected tool on AppState
    AppState.Tools.selected = 'rectangle';

    activate(settings, AppState);
  });

  var mousedown = function(data) {
    isDown = true;
    //data.originalEvent.preventDefault();
    originalCoords = data.getLocalPosition(this);

    rect = new Rectangle(Tools.rectangle);
    // rect.setProperties(Tools.rectangle);
    console.log('RECT', rect.graphics);
    //socket.emit(EVENT.shapeObject, 'add', rect.getProperties());
    //console.log(rect);
    //console.log('rect added', rect.getProperties());
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
        socket.emit(EVENT.shapeObject, 'draw', rect.getProperties());
      }
      else {
        // Adds shape to the shapes object/container and stage
        rect = shapes.addNew(rect);

        // Send socket info since drawing has began now
        socket.emit(EVENT.shapeObject, 'add', rect.getProperties());
      }

      drawBegan = true;
    }
  };

  var mouseup = function(data) {
    //data.originalEvent.preventDefault();
    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      // Check if Shape was actually drawn, ie. did user press mouse down and mouse move, which draws a Shape, or
      // just simply press mouse down, which is not considered drawing
      if(drawBegan) {

        rect.setRectMoveListeners(AppState);

        console.log('rect._id', rect);

        rect.unHighlight();

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        socket.emit(EVENT.shapeObject, 'interactionEnd', rect._id);
      }
      else {
        // We always add a Shape Id to hash on
        shapes.removeShape(rect);

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        socket.emit(EVENT.shapeObject, 'remove', rect._id);
      }
    }
    isDown = drawBegan = false;
  };

  // var mouseout = function(data) {
  //   if(isDown) {
  //     if(drawBegan) {
  //       rect.setRectMoveListeners(AppState);
  //     }
  //     else {
  //       shapes.removeShape(rect);
  //     }
  //   }

  //   isDown = drawBegan = false;
  // }

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseup;
  }

};

