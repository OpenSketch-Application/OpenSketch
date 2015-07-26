'use strict';
var PIXI = require('pixi');
var Textbox = require('../shapes/Text');
var EVENT = require('../../../../model/model').socketEvents;
var PixiTextInput = require('../shapes/PixiTextInput');

module.exports = function(el, AppState) {
  console.log('AppState', AppState);
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

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    console.log('Selected Text...');
    //if(settings.toolbar.toolSelected) return;
    //Return early if toolbar Select was picked

    // Set the selected tool on AppState
    AppState.Tools.selected = 'text';

    // Activates the mouse listeners
    activate();

    return false;
  });

  var mousedown = function(data) {
    data.originalEvent.preventDefault();
    isDown = true;
    originalCoords = data.getLocalPosition(this);

    if(textbox) textbox.unHighlight();

    // stage.addChild(_Text);
    textbox = new Textbox(Tools.text);

    var shapeProperties = {
      x: originalCoords.x,
      y: originalCoords.y,
      width: textbox.pixiText.width,
      height: textbox.pixiText.height
    }

    textbox.draw(shapeProperties);

    textbox = shapes.addNew(textbox);

    console.dir(textbox);

    // Adds shape to the shapes object/container and stage
    socket.emit(EVENT.shapeEvent, 'add', textbox.getProperties());

    socket.emit(EVENT.shapeEvent, 'draw', textbox.getProperties());
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

      textbox.draw({
        x: topX,
        y: topY,
        width: width,
        height: height
      });


      //console.log(text);

    //   //console.log(text);
    //   text.highlight();

    //   if(drawBegan) {
    //     socket.emit(EVENT.shapeEvent, 'draw', text.getProperties());
    //   }
    //   else {
    //     // Adds shape to the shapes object/container and stage
    //     text = shapes.addNew(text);

    //     // Send socket info since drawing has began now
    //     socket.emit(EVENT.shapeEvent, 'add', text.getProperties());
    //   }

      drawBegan = true;
    }
  };

  var mouseup = function(data) {

    //data.originalEvent.preventDefault();
    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      console.log('Setting text listeners');

      textbox.setListeners(AppState);

      //socket.emit(EVENT.shapeEvent, 'drawEnd', { _id: textbox._id });

      //socket.emit(EVENT.saveObject, textbox.getProperties());

      // Check if Shape was actually drawn, ie. did user press mouse down and mouse move, which draws a Shape, or
      // just simply press mouse down, which is not considered drawing
      if(drawBegan) {

        console.log('text._id', textbox);

        //text.unHighlight();

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        //socket.emit(EVENT.shapeEvent, 'interactionEnd', text._id);
      }
      else {
        // Remove add shape if user had not actually drawn fully
        //if(text) shapes.removeShape(text);

        // Emit socket interactionEnd Event, since drawing has ended on mouse up
        //socket.emit(EVENT.shapeEvent, 'remove', text._id);
      }

      // Send click event on Select Tool
      AppState.ToolBar.toolButtons.select.click();
    }

    isDown = drawBegan = false;
  };

  function activate() {
    stage.mousedown = mousedown;
    //stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    //stage.mouseout = mouseup;
  }

};

