var PIXI = require('pixi');

var Line = {
  stage: null,
  renderer: null,
  fillColor: null
};

Line.set = function(stage, renderer) {
  this.stage = stage;
  this.renderer = renderer;
};

Line.makeShape = function(startCoords, dimensions, style) {
  var graphics = new PIXI.Graphics();
  graphics.interactive = true;

  //graphics.beginFill(0xFFFFFF);
  graphics.lineWidth = 2;
  graphics.lineColor = 0x000000;

  graphics.lineTo(
    startCoords.x,
    startCoords.y
  );

  return graphics;
};

module.exports = Line;
