var PIXI = require('pixi');

module.exports = CanvasStage;

function CanvasStage(width, height) {
  PIXI.DisplayObjectContainer.call(this);

  this.interactive = true;

  this.containerWidth = width;
  this.containerHeight = height;

  this.mousePressPoint = [];

  this.zoom = 1;

  this.scale.x = this.scale.y = this.zoom;

  this.origin = { x: 0, y: 0 };

  this.beginFill(0xFFFFFF);
  this.drawRect(0,0,width,height);
  this.endFill();
}

CanvasStage.prototype = new PIXI.Graphics();
CanvasStage.prototype.constructor = CanvasStage;

CanvasStage.prototype.setMouseEvents = function(AppState) {
  this.mousedown = function(data) {
    this.dragging = true;
    console.log('dragging click true');
    this.mousePressPoint[0] = data.getLocalPosition(this.parent).x -
                              this.position.x;
    this.mousePressPoint[1] = data.getLocalPosition(this.parent).y -
                              this.position.y;

  };

  this.mouseup = this.mouseupoutside = function(data) {
    this.dragging = false;
  };

  this.mousemove = function(data) {
    if(this.dragging) {
      var position = data.getLocalPosition(this.parent);
      this.position.x = position.x - this.mousePressPoint[0];
      this.position.y = position.y - this.mousePressPoint[1];


    }
    else {
      var mouseOverPoint = [0, 0];
      mouseOverPoint[0] = data.getLocalPosition(this.parent).x -
                          this.position.x;
      mouseOverPoint[1] = data.getLocalPosition(this.parent).y -
                          this.position.y;
    }
  };
};

Object.defineProperty(CanvasStage, 'zoom', {
  get: function() {
    return this.scale.x;
  },
  set: function(v) {
    this.scale.x = this.scale.y = v;
  }
});

CanvasStage.prototype.constrainContainer = function() {
  // this.position.x = Math.max(this.position.x, -1 * this.width * this.zoom + this.renderWidth);
  // this.position.x = Math.min(this.position.x, 0);
  // this.position.y = Math.max(this.position.y, -1 * this.height * this.zoom + this.renderHeight);
  // this.position.y = Math.min(this.position.y, 0);
}

