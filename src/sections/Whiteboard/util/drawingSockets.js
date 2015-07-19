var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
var Rectangle = require('./shapes/Rectangle');
var Pencil = require('./shapes/Pencil');
var Ellipse = require('./shapes/Ellipse');
var Line = require('./shapes/Line');
var Table = require('./shapes/Table');


module.exports = function(AppState) {

  var stage = AppState.Canvas.stage;
  var shapes = AppState.Canvas.Shapes;
  var socket = AppState.Socket;

  // Main handler for all Shape Events
  socket.on(EVENT.shapeEvent, handleShapeEvent);

  socket.on(EVENT.sendPencil,function(shapeObject, addFirst) {
  });

  // Handles populating a new participant's Canvas with Shapes
  socket.on(EVENT.populateCanvas, function(shapelist) {
    console.log('POPULATE', shapelist);
    if(shapelist) {
      shapelist.forEach(function(shape) {
        console.log('Adding shape', shape);
        var addedShape = addShapeBasedOnType(shape);
        addedShape.draw(shape);
        addedShape.unHighlight();
        addedShape.setMoveListeners(AppState);
        if(shape.hasMoved){
          addedShape.move({x:shape.moveX,y:shape.moveY});
        }
      });
    }
  });

  // Specific Shape Events
  // INCLUDE in only Socket Event, as first parameter
  // 'add'
  // 'draw'
  // 'drawEnd'
  // 'move'
  // 'modify'
  // 'remove'
  // lockShape
  // unlockShape
  function handleShapeEvent(eventType, shapeData) {
    console.log('handle shape event', eventType, shapeData);
    switch(eventType) {
      case 'draw':
        shapes[shapeData._id].draw(shapeData);
        shapes[shapeData._id].highlight();
        break;

      // Any interaction that involves a mouseup or mousedown
      case 'drawEnd':
        // shapeData is just an _id property
        shapes[shapeData._id].setMoveListeners(AppState);
        shapes[shapeData._id].unHighlight();
        break;

      case 'lockShape':
        console.log('lock current shape');

        shapes[shapeData._id].lockShape();
        break;

      case 'unlockShape':
        console.log('unlock shape');
        shapes[shapeData._id].unLockShape();
        break;

      case 'move':
        shapes[shapeData._id].move(shapeData);
        break;

      // CRUD events for Shapes
      case 'add':
        // Uses helper function defined below
        addShapeBasedOnType(shapeData);
        break;

      case 'modify':
        // redraw the shape with new properties
        shapes[shapeData._id].draw(shapeData);
        break;

      case 'remove':
        shapes.removeShapeByID(shapeData);
        break;
    }
  }

  // Calls the right constructor based on the Object's shapeType
  function addShapeBasedOnType(shapeData) {
    var shape;
    
    switch(shapeData.shapeType) {
      case 'rectangle':
        //AppState.Canvas.stage.addChild(shapeData);
        shape = new Rectangle(shapeData);
        break;
      case 'line':
        shape = new Line(shapeData);
        break;
      case 'ellipse':
        shape = new Ellipse(shapeData);
        break;
      // Flow Chart Shapes
      case 'flowChartFunction':
        break;
      case 'table':
        shape = new Table(shapeData);
        break;
    }

    // Add Shape to the Shapes hashmap
    if(shape) return shapes.addNew(shape);
    else console.log('ERROR: Did not create a Shape of requested type', shapeData);

    return shape;
  }


};

