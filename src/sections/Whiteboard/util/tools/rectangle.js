'use strict';
var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {
  var stage = AppState.Canvas.stage;
  var socket = AppState.socket;
  var shapes = AppState.Canvas.Shapes;
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
    data.originalEvent.preventDefault();
    originalCoords = data.getLocalPosition(this);

    rect = new Rect(AppState.Tools.rectangle, stage);

    rect.addNew(shapes, AppState.Users.currentUser._id);

  };

  var mousemove = function(data) {
    if(isDown) {
      data.originalEvent.preventDefault();
      var localPos = data.getLocalPosition(this);
      var topLeft = {};

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

      rect.getProperties();

      drawBegan = true;
    }
  };

  var mouseup = function(data) {
    data.originalEvent.preventDefault();

    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      // Add Shape to Canvas shapes map
      //rect.addNew(shapes, AppState.Users.currentUser._id);

      // Set active listeners on added Shape
      rect.setRectMoveListeners(AppState);
      //var socketRect = rect.getProperties();

      // Emit socket Add Event
      //socket.emit(EVENT.sendRect, EVENT.add, socketRect);
      if(drawBegan) {
        rect.setRectMoveListeners(AppState);
      }
      else {
        // Null currently set Shape in shapes
        stage.removeChildAt(shapes[rect._id].layerLevel);
        rect.remove(shapes);
        //shapes[rect._id] = null;
      }
    }


    isDown = drawBegan = false;
  };

  var mouseout = function(data) {
    if(isDown) {
      if(drawBegan) {
        rect.setRectMoveListeners(AppState);
      }
      else {
        rect.remove(shapes);
        //shapes[rect._id] = null;
      }
    }


    isDown = drawBegan = false;
  }

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseout;
  }

};

