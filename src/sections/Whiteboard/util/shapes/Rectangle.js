var PIXI = require('pixi');

var Rectangle = {
  stage: null,
  renderer: null,
  fillColor: null,
  graphics: null
};

Rectangle.set = function(stage, renderer) {
  this.stage = stage;
  this.renderer = renderer;
  this.graphics = new PIXI.Graphics();
};

Rectangle.makeRect = function(startCoords, dimensions, style) {
  graphics.interactive = true;
  graphics.beginFill(0xFFFFFF); // style.fillColor
  graphics.lineWidth = 2; // style.lineWidth
  graphics.lineColor = 0x000000; // style.lineColor

  graphics.drawRect(
    startCoords.x,
    startCoords.y,
    dimensions.width,
    dimensions.height
  );

  return graphics;
};

Rectangle.reDraw = function(startCoords, dimensions, style) {

}

module.exports = Rectangle;
