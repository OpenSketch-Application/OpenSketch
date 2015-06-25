//'use strict';
//var PIXI = require('pixi');
// Global AppState
module.exports = function(graphics, shapeObject, AppState) {
  var selected = false;
  var original;
  var movingSelf = false;
  var Shapes = AppState.Canvas.Shapes;
  //var graphics = shapeObject.graphics;
  var socket = AppState.Socket;

  graphics.mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    data.originalEvent.preventDefault();
    if(AppState.Tools.selected === 'select') {


      this.data = data;
      original = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      //graphics.selected = true;
      //console.log(AppState);
      AppState.Tools.select.selectedObject = shapeObject;

    }
    else if(AppState.Tools.selected === 'fill') {

      this.clear();
      console.log('fill Color: ' + AppState.Tools.fill.fillColor);
      this.endFill(AppState.Tools.fill.fillColor);
      AppState.Canvas.stage.addChild(this);
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
    }
  };

  graphics.mouseup = graphics.mouseupoutside = function(data) {
    selected = false;
    this.alpha = 1;
    //shapeObject.selected = false;
    // set the interaction data to null
    this.data = null;
    movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  };
};
