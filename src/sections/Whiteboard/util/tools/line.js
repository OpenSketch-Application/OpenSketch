var PIXI = require('pixi');
var Line = require('../shapes/Line');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(settings, el, AppState) {
  el.addEventListener('click', function(data) {
    console.log('Selected Shapes...');
    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    Line.set(settings.stage, settings.renderer);
    activate(settings, AppState);
  });
};

function activate(settings, AppState) {
  // var isActive = true;
  var isDown = false;
  var originalCoords;
  var curStageIndex = 0;
  var drawBegan = false;
  var graphics;
  var inverse;
  var stage = settings.stage;
  var renderer = settings.renderer;

  stage.mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    movingSelf = true;
    this.data = data;
    originalCoords = data.getLocalPosition(this);
    graphics = new PIXI.Graphics();

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
      var localPos = data.getLocalPosition(this);

      graphics.clear();

      graphics.lineWidth = 2;
      graphics.lineColor = 0x000000;
      graphics.moveTo(localPos.x, localPos.y);
      graphics.lineTo(originalCoords.x, originalCoords.y);

      stage.addChild(graphics);
      //SocketObject.emitDrawingObject(graphics);
      drawBegan = true;
    }
  };

  stage.mouseup = function(data) {
    movingSelf = false;
    graphics.interactive = true;

    if(isDown) {
      AppState.Canvas.addNew('line', graphics);
    }
    drawBegan = false;
    isDown = false;

    setMoveShapeListeners(graphics, settings, AppState);
    //SocketObject.emitDrawObject(graphics);

    //SocketObject.emitObjectAddDone(graphics);
  };

  // stage.mouseout = function(data) {
  //   isDown = false;
  //   //graphics = undefined;
  // }
}
