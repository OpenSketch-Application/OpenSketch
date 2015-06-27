'use strict';
var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {
  var stage = AppState.Canvas.stage;
  var Socket = AppState.Socket;
  var Shapes = AppState.Canvas.Shapes;
  var isDown = false;
  var drawBegan = false;
  var rect;
  var originalCoords;

  el.addEventListener('click', function(data) {
    data.preventDefault();
    console.log('Selected Shapes...');
    //if(settings.toolbar.toolSelected) return;
    //// Return early if toolbar Select was picked

    // Set the selected tool on AppState
    AppState.Tools.selected = 'rectangle';

    activate(settings, AppState);
  });

  var mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    originalCoords = data.getLocalPosition(this);

    rect = new Rect(AppState.Tools.rectangle);
  };

  var mousemove = function(data) {
    if(isDown) {
      data.originalEvent.preventDefault();
      var localPos = data.getLocalPosition(this);
      var topLeft = {};

      // graphics.clear();
      // graphics.interactive = false;
      // graphics.beginFill(0xFFFFFF); // style.fillColor
      // graphics.lineWidth = 2; // style.lineWidth
      // graphics.lineColor = 0x000000; // style.lineColor

      var width = localPos.x - originalCoords.x;
      var height = localPos.y - originalCoords.y;

      // Ensure height and width are positive
      if(width < 0) width *= -1;
      if(height < 0) height *= -1;

      topLeft.x = Math.min(originalCoords.x, localPos.x);
      topLeft.y = Math.min(localPos.y, originalCoords.y);

      rect.draw({
        x: topLeft.x,
        y: topLeft.y,
        width: width,
        height: height
      }, AppState.Canvas.stage);

      drawBegan = true;
    }
  };

  var mouseup = function(data) {
    data.originalEvent.preventDefault();

    // Flag that tells us that mouse button was pressed down before
    if(isDown && drawBegan) {
      // Add Shape to Canvas Shapes map
      rect.addNew(Shapes, AppState.Users.currentUser._id);

      // Set active listeners on added Shape
      rect.setRectMoveListeners(AppState);
      //var socketRect = rect.getProperties();

      // console.log(socketRect);
      // console.log(Socket);
      // // Emit Socket Add Event
      // Socket.emit(EVENT.sendRect, EVENT.add, socketRect);
    }

    isDown = drawBegan = false;
  };

  // var mouseout = function(data) {
  //   isDown = false;
  // }

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    //stage.mouseout = mouseout;
  }

};

