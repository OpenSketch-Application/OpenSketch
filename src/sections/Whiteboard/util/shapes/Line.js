var PIXI = require('pixi');

var Line = {
  stage: null,
  renderer: null,
  fillColor: null
};

Line.set = function(stage, renderer) {
  this.stage = stage;
  this.renderer = renderer;
  this.graphics = new PIXI.Graphics();
  this.stage.addChild(this.graphics);
};

Line.makeShape = function(startCoords, endCoords, style) {
  //var graphics = new PIXI.Graphics();
  this.graphics.interactive = true;

  this.graphics.lineWidth = 2;
  this.graphics.lineColor = 0x000000;
  this.graphics.moveTo(endCoords.x, endCoords.y);

  this.graphics.lineTo(startCoords.x, startCoords.y);

  return this.graphics;
};

Line.reDrawShape = function(startCoords, endCoords, style) {
  //this.graphics.addChild(this.currentObject);
  this.graphics.clear();
  this.makeShape(startCoords, endCoords, style);
  this.stage.addChild(this.graphics);
}

Line.newShape = function() {
  var curShape = this.graphics;
  this.graphics = new PIXI.Graphics();
  return curShape;
}

Line.getShape = function() {
  return this.graphics;
}

Line.removeShapeAt = function(graphics, index) {
  this.stage.removeChild(graphics, index);
}

Line.removeShape = function() {
  // console.log(this.stage.children.length);
  return this.stage.removeChild(this.graphics);
}

module.exports = Line;
