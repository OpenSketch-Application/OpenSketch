'use strict';

// Global AppState
module.exports = function(shapeObject, shapeObject, AppState) {
  var selected = false;
  var original;
  var movingSelf = false;
  var Shapes = AppState.Canvas.Shapes;
  var graphics = shapeObject.graphics;
  var socket = AppState.Socket;

  graphics.mousedown = function(data) {
    if(AppState.Tools.selected === 'tool-select') {
      data.originalEvent.preventDefault();

      this.data = data;
      original = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      graphics.selected = true;

      // socket.emit('shapeSelected', shapeObject.properties());
    }
  };

  graphics.mousemove = function(data)
  {
    if(selected) {
      var newPosition = this.data.getLocalPosition(this.parent);
      movingSelf = true;

      this.position.x = newPosition.x - original.x;
      this.position.y = newPosition.y - original.y;

      var newPos = {
        x: this.position.x,
        y: this.position.y
      };
      //console.log(newPosition);
      //SocketObject.emitMoveObject(newPos, stage.getChildIndex(this));
    }
  };

  graphics.mouseup = graphics.mouseupoutside = function(data) {
    selected = false;
    this.alpha = 1;
    graphics.selected = false;
    // set the interaction data to null
    this.data = null;
    movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  };
};
