'use strict';
var PIXI = require('pixi');
var Textbox = require('../shapes/Text');
var EVENT = require('../../../../model/model').socketEvents;
//var PixiTextInput = require('../shapes/PixiTextInput');

module.exports = function(el, AppState) {
  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;
  var Tools = AppState.Tools;
  var isDown = false;
  var drawBegan = false;
  var textbox;
  var originalCoords;

  el.addEventListener('click', function(data) {
    data.preventDefault();
    console.log('Selected Text...');

    // Set the selected tool on AppState
    AppState.Tools.selected = 'text';

    activate();

  });

  function mousedown(data) {
    isDown = true;

    originalCoords = data.getLocalPosition(this);

    if(textbox) textbox.unHighlight();

    textbox = new Textbox(Tools.text);

    var shapeProperties = {
      x: originalCoords.x,
      y: originalCoords.y,
      width: textbox.width,
      height: textbox.height
    }

    textbox.draw(shapeProperties);

    textbox = shapes.addNew(textbox);

    //console.dir(textbox);
  };

  function mousemove(data) {
    if(isDown) {
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

      textbox.draw({
        x: topX,
        y: topY,
        width: width,
        height: height
      });

      drawBegan = true;
    }
  };

  function mouseup(data) {

    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      console.log('Setting text listeners');

      textbox.setMoveListeners(AppState);

      socket.emit(EVENT.shapeEvent, 'add', textbox.getProperties());

      socket.emit(EVENT.saveObject, textbox.getProperties());

    }

    isDown = drawBegan = false;
  };

  function activate() {
    stage.mousedown = mousedown;
    stage.mouseup = mouseup;
  }

};

