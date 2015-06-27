var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
var Rectangle = require('./shapes/Rectangle');

module.exports = function(AppState) {
  var stage = AppState.Canvas.stage;
  var shapes = AppState.Canvas.Shapes;
  var canvas = AppState.Canvas;
  var socket = AppState.Socket;
  var tools = AppState.Tools;



  socket.on(EVENT.sendPencil,function(shapeObject, addFirst){
    var Shape;

    if(addFirst)
      Shape = shapes.addNew(shapeObject);
    else {
      Shape = shapes[shapeObject._id];
    }

    Shape.setProp(shapeObject);

    Shape.graphics.lineStyle(info.strokeWeight, info.color);
    Shape.graphics.moveTo(info.x1, info.y1);
    Shape.graphics.lineTo(info.x2, info.y2);
    Shape.stage.addChild(graphics);

  });

  socket.on(EVENT.sendRect, function(eventType, shapeProperties) {
    console.log('event sendRect recieved');
    switch(eventType) {
      case EVENT.draw:
        shapes[shapeProperties._id].draw(shapeProperties);
        break;
      case EVENT.interactionEnd:
        shapes[shapeProperties._id].interact(shapeProperties);
        break;
      case EVENT.interactionBegin:
        shapes[shapeProperties._id].interact(shapeProperties);
        break;
      case EVENT.move:
        shapes[shapeProperties._id].move(shapeProperties);
        break;
      case EVENT.add:
        console.log('recieved add', shapeProperties);
        //AppState.Canvas.stage.addChild(shapeProperties);
        var rect = new Rectangle(shapeProperties);

        //shapes.addNew(shapeProperties);
        break;
      case EVENT.modify:
        shapes[shapeProperties._id].modify(shapeProperties);
        break;
      case EVENT.remove:
        shapes[shapeProperties._id].remove();
        break;
    }
  })
 };

