var PIXI = require('pixi');

var Rectangle = {
  stage: null,
  renderer: null,
  fillColor: null
};

Rectangle.set = function(stage, renderer) {
  this.stage = stage;
  this.renderer = renderer;
};

Rectangle.makeRect = function(startCoords, dimensions, style) {
  var graphics = new PIXI.Graphics();
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

module.exports = Rectangle;
