var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
var Rectangle = require('./shapes/Rectangle');

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

  socket.on(EVENT.sendRect, function(eventType, shapeData) {
    console.log('event sendRect recieved ', eventType);
    switch(eventType) {
      case 'draw':
        console.log('received draw shape');
        shapes[shapeData._id].draw(shapeData);
        shapes[shapeData._id].highlight();
        break;
      case 'interactionEnd':
        //shapes[shapeData._id].interact(shapeData);
        console.log('eventType', shapeData);
        shapes[shapeData].setRectMoveListeners(AppState);
        shapes[shapeData].unHighlight();
        break;
      case 'interactionBegin':
        shapes[shapeData._id].interact(shapeData);
        break;
      case 'move':
        shapes[shapeData._id].move(shapeData);
        break;
      case 'add':
        console.log('recieved add', shapeData);
        //AppState.Canvas.stage.addChild(shapeData);
        var rect = new Rectangle(shapeData, stage);

        rect.addNew(shapes);
        break;
      case 'modify':
        shapes[shapeData._id].modify(shapeData);
        break;
      case 'remove':
        shapes[shapeData._id].remove();
        break;
    }
  })
 };

