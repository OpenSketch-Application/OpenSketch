var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
var Rectangle = require('./shapes/Rectangle');
var Line = require('./shapes/Line');

module.exports = function(AppState) {
  var stage = AppState.Canvas.stage;
  var shapes = AppState.Canvas.Shapes;
  var canvas = AppState.Canvas;
  var socket = AppState.Socket;

  socket.on(EVENT.sendPencil,function(shapeObject, addFirst){
    // var Shape;

    // if(addFirst)
    //   Shape = shapes.addNew(shapeObject);
    // else {
    //   Shape = shapes[shapeObject._id];
    // }

    // Shape.setProp(shapeObject);

    // Shape.graphics.lineStyle(info.strokeWeight, info.color);
    // Shape.graphics.moveTo(info.x1, info.y1);
    // Shape.graphics.lineTo(info.x2, info.y2);
    // Shape.stage.addChild(graphics);

  });

  socket.on(EVENT.shapeObject, function(eventType, shapeData) {
    console.log('event shapeObject recieved ', eventType);

    switch(eventType) {
      case 'draw':
        console.log('received draw shape', shapeData);
        shapes[shapeData._id].draw(shapeData);
        shapes[shapeData._id].highlight();
        break;

      // Any interaction that involves a mouseup or mousedown
      case 'interactionEnd':
        //console.log('eventType', eventType, 'shape', shapeData);
        // shapeData is just an _id property
        shapes[shapeData].setRectMoveListeners(AppState);
        shapes[shapeData].unHighlight();
        break;

      case 'interactionBegin':
        shapes[shapeData].interactive = false;
        shapes[shapeData].highlight();
        //shapes[shapeData._id].interact(shapeData);
        break;
      case 'shapeLock':
        shapes[id].lockShape();
        break;
      case 'shapeUnlock':
        shapes[id].unlockShape();
        break;
      case 'move':
        //console.log('moving shape', shapeData);
        shapes[shapeData._id].move(shapeData);
        break;

      case 'add':

        addShapeBasedOnType(shapeData);

        break;

      case 'modify':
        console.log('modify shape', shapeData);
        // redraw the shape with new properties
        shapes[shapeData._id].draw(shapeData);

        //shapes[shapeData._id].highlight();
        break;

      case 'remove':
        shapes.removeShapeByID(shapeData);
        break;
    }
  })

  function addShapeBasedOnType(shapeData) {
    console.log('recieved add', shapeData);
    var shape;

    switch(shapeData.objectType) {
      case 'rectangle':
        //AppState.Canvas.stage.addChild(shapeData);
        shape = new Rectangle(shapeData);
        break;
      case 'line':
        shape = new Line(shapeData);
        break;
    }

    // Add Shape to the Shapes hashmap
    if(shape) shapes.addNew(rect);
    else console.log('ERROR: Did not create a Shape of requested type', shapeData);
  }

 };

