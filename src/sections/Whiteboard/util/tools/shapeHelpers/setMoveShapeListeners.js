'use strict';
// Global AppState
module.exports = function(graphics, settings) {
  var selected = false;
  graphics.mousedown = function(data) {
    //console.log(settings.selected);
    //window.settings = settings;
    if(settings.selectedTool() === 'tool-select') {
      data.originalEvent.preventDefault();

      this.data = data;
      original = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
    }
    //var graphicsData = this.graphicsData;
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
    //this.dragging = false;

    // set the interaction data to null
    this.data = null;
    movingSelf = false;

    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  };
};
