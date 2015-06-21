var PIXI = require('pixi');
var Line = require('../shapes/Line');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Line...');

    AppState.Tools.toolSelected = AppState.Tools.line;

    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    activate(AppState.Canvas.stage, AppState.Canvas.renderer, AppState.Tools.line);
  });
};

function activate(stage, renderer, LineTool) {
  // var isActive = true;
  var isDown = false;
  var originalCoords;
  var curStageIndex = 0;
  var drawBegan = false;
  var graphics;
  var inverse;

  //Line.set(stage, renderer, LineTool);

  // var stage = stage;
  // var renderer = AppState.Canvas.renderer;
  stage.mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    movingSelf = true;
    this.data = data;
    startCoords = data.getLocalPosition(this);

    graphics = new PIXI.Graphics();
    stage.addChild(this.graphics);
    // SocketObject.emitDrawObject({
    //   objectType: 'rectangle',
    //   startCoords: originalCoords,
    //   dimensions: {
    //     width: 1,
    //     height: 1
    //   },
    //   color: 0xFF0000,
    //   stageIndex: curStageIndex + 1
    // });

    console.log("drawing");
  };

  stage.mousemove = function(data) {
    if(isDown) {
      var endCoords = data.getLocalPosition(this);
      this.graphics.clear();
      //this.makeShape(startCoords, endCoords, style);

      graphics.interactive = false;
      graphics.lineWidth = 2;
      graphics.lineColor = 0x000000;
      graphics.moveTo(endCoords.x, endCoords.y);
      graphics.lineTo(startCoords.x, startCoords.y);

      stage.addChild(this.graphics);

      //SocketObject.emitDrawingObject(graphics);
    }
  };

  stage.mouseup = function(data) {
    isDown = false;
    movingSelf = false;

    graphics.interactive = true;
    // Line.getShape();
    // graphics = null;

    // var graphics = new PIXI.Graphics();
    //SocketObject.emitDrawObject(graphics);

    //SocketObject.emitObjectAddDone(graphics);
  };

  stage.mouseout = function(data) {
    isDown = false;
    movingSelf = false;

    graphics.clear();
  }
}
