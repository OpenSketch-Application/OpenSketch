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
  this.currentObject = null;
  this.size = 0;
};

Line.makeShape = function(startCoords, endCoords, style) {
  //var graphics = new PIXI.Graphics();
  this.graphics.interactive = true;

  //graphics.beginFill(0xFFFFFF);
  this.graphics.lineWidth = 2;
  this.graphics.lineColor = 0x000000;
  this.graphics.moveTo(endCoords.x, endCoords.y);

  this.graphics.lineTo(startCoords.x, startCoords.y);
  this.size++;

  return this.graphics;
};

Line.reDrawShape = function(startCoords, endCoords, style) {
  //this.graphics.addChild(this.currentObject);
  this.graphics.clear();
  this.makeShape(startCoords, endCoords, style);
  this.stage.addChild(this.graphics);
}

Line.getShape = function() {
  var curShape = this.graphics;
  this.graphics = new PIXI.Graphics();
  return curShape;
}

Line.removeShapeAt = function(graphics, index) {
  this.stage.removeChild(graphics, index);
}

Line.removeShape = function() {
  // console.log(this.stage.children.length);
  return this.stage.removeChild(this.graphics);
}

module.exports = Line;
