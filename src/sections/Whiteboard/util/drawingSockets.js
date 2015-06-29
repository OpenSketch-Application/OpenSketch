var PIXI = require('pixi');
var EVENT = require('../../../model/model').socketEvents;
function drawShape(info,stage){
  var graphics = new PIXI.Graphics().lineStyle(info.strokeWeight,info.color); 

  switch(info.type){
      case 'line':
        graphics.moveTo(info.x1,info.y1);
        graphics.lineTo(info.x2,info.y2);
        stage.addChild(graphics);
        break;
      case 'rectangle':
        graphics.beginFill(0xFFFFFF);        
        graphics.drawRect(info.x,info.y,info.w,info.h);
        graphics.endFill();
        stage.addChild(graphics);
        break;
      case 'ellipse':
        graphics.beginFill(0xFFFFFF);        
        graphics.drawEllipse(info.x,info.y,info.w,info.h);
        graphics.endFill();
        stage.addChild(graphics);
        break;
      case 'pencil':
        graphics.drawPolygon(info.path);
        stage.addChild(graphics);
        break;

    }
}
module.exports = function(socket, stage) {

  socket.on(EVENT.sendPencil,function(info){
     var graphics = new PIXI.Graphics().lineStyle(info.strokeWeight, info.color);
     graphics.moveTo(info.x1, info.y1);
     graphics.lineTo(info.x2, info.y2);
     stage.addChild(graphics);
  });
  socket.on(EVENT.sendObject,function(info){
        drawShape(info,stage); 
  });
  socket.on(EVENT.updateCanvas, function(shapes){
    var graphics; 

    for(var i=0;i<shapes.length;i++){
      graphics = new PIXI.Graphics().lineStyle(shapes[i].strokeWeight,shapes[i].color);
      drawShape(shapes[i],stage);
      //var graphics = new PIXI.Graphics().lineStyle(shapes[i].strokeWeight,shapes[i].color);
      //for(var j= 0; j<path.length-1;j++){
      //  graphics.moveTo(path[j].x,path[j].y);
      //  graphics.lineTo(path[j+1].x,path[j+1].y);
      //  stage.addChild(graphics);
      // }
      //graphics.drawPolygon(shapes[i].path);
      //stage.addChild(graphics);
      //repeat for each type of shape
    }
  });
 };
