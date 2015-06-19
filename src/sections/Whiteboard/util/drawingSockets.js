var PIXI = require('pixi');

module.exports = function( socket,stage) {
  
  socket.on('sendDrawing',function(info){
     graphics = new PIXI.Graphics().lineStyle(info.strokeWeight, info.color);
     graphics.moveTo(info.x1, info.y1);
     graphics.lineTo(info.x2, info.y2);
     stage.addChild(graphics);

  });

 }; 
