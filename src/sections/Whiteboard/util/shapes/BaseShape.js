'use strict';
var PIXI = require('pixi');
module.exports = BaseShape;

function BaseShape() {
  this.graphics = new PIXI.Graphics();
};

BaseShape.prototype.getProperties = function() {
  return {
    _id: this._id,
    userId: this.userId,
    layerLevel: this.layerLevel,
    rotation: this.graphics.rotation,
    interactive: this.graphics.interactive,
    alpha: this.graphics.alpha
  }
};

BaseShape.prototype.setProperties = function(shapeProperties) {
  if(shapeProperties._id) this._id = shapeProperties._id;
  if(shapeProperties.userId) this.userId = shapeProperties.userId;
  if(shapeProperties.rotation) this.rotation = shapeProperties.rotation;
  if(shapeProperties.layerLevel) this.layerLevel = shapeProperties.layerLevel;
  if(shapeProperties.interactive) this.interactive = shapeProperties.interactive;
  if(shapeProperties.alpha) this.alpha = shapeProperties.alpha;
};

BaseShape.prototype.setListeners = function(Stage, Shapes, Socket) {
  var original;
  var selected = false;

  this.graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    data.originalEvent.preventDefault();

    if(AppState.Tools.selected === 'select') {

      this.data = data;
      original = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      //graphics.selected = true;
      //console.log(AppState);
      AppState.Tools.select.selectedObject = this;

    }
    else if(AppState.Tools.selected === 'fill') {
      this.clear();
      console.log('fill Color: ' + AppState.Tools.fill.fillColor);
      //this.endFill(AppState.Tools.fill.fillColor);
      //AppState.Canvas.stage.addChild(this);
    }
  };

  graphics.mousemove = function(data)
  {
    if(selected) {
      var newPosition = this.data.getLocalPosition(this.parent);
      //movingSelf = true;

      this.position.x = newPosition.x - original.x;
      this.position.y = newPosition.y - original.y;

      // var newPos = {
      //   x: this.position.x,
      //   y: this.position.y
      // };
    }
  };

  graphics.mouseup = function(data) {
    selected = false;
    this.alpha = 1;
    //shapeObject.selected = false;
    // set the interaction data to null
    this.data = null;
    //movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  };
}









