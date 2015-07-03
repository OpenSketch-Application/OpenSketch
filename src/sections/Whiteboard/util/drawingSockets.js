var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
var Rectangle = require('./shapes/Rectangle');
var Pencil = require('./shapes/Pencil');
function shapeControl(eventType,shapeData,AppState){
  var shapes = AppState.Canvas.Shapes;

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
      case 'move':
        //console.log('moving shape', shapeData);
        shapes[shapeData._id].move(shapeData);
        break;
      // case 'moveTo':
      //   //console.log('moving shape', shapeData);
      //   shapes[shapeData._id].moveTo(shapeData);
      //   break;
      case 'add':
        console.log('recieved add', shapeData);
        //AppState.Canvas.stage.addChild(shapeData);
        // Pass shape type to another function
        switch(shapeData.objectType){
          case 'pencil':
            var pen = new Pencil(shapeData);   
            pen.draw(shapeData.path);
            shapes.addNew(pen);

            break;
          case 'rectangle':
            
            var rect = new Rectangle(shapeData);
            rect.draw(shapeData);
            shapes.addNew(rect);
            break;
        }

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
}
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
    shapeControl(eventType,shapeData,AppState);
     
  });
  socket.on(EVENT.populateCanvas, function(shapelist){
    console.log('POPUlatecanvas');
    for(var i = 0; i<shapelist.length;i++){
      shapeControl('add',shapelist[i],AppState);
    }
  });
 };

