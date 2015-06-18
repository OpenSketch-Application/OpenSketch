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

Rectangle.makeRect = function(startCoords, dimensions, color, curStageIndex) {
  var graphics = new PIXI.Graphics();
  graphics.interactive = true;

  graphics.beginFill(0xFFFFFF);
  graphics.lineWidth = 2;
  graphics.lineColor = 0x000000;

  graphics.drawRect(
    startCoords.x,
    startCoords.y,
    dimensions.width,
    dimensions.height
  );

  return graphics;
};

module.exports = Rectangle;
