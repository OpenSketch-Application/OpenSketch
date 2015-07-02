var PIXI = require('pixi');
var BaseShape = require('./BaseShape');


module.exports = Line;

function Line(shapeProperties) {
  this.graphics = new PIXI.Graphics();
  this.hightlightShape = new PIXI.Graphics();

  this.graphics.addChild(this.hightlightShape);

  this.objectType = 'line';

}

Line.prototype = new BaseShape();

