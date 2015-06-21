var PIXI = require('pixi');
var Line = require('../shapes/Line');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(settings, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Shapes...');
    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    Line.set(settings.stage, settings.renderer);
    activate(settings);
  });
};


function activate(settings) {
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
      var topLeft = {};
      var childIndex = 0;

      Line.reDrawShape(originalCoords, localPos, {});

      //SocketObject.emitDrawingObject(graphics);

      drawBegan = true;
    }
  };

  stage.mouseup = function(data) {
    drawBegan = false;
    isDown = false;
    movingSelf = false;

    Line.getShape();
    graphics = null;
    // var graphics = new PIXI.Graphics();
    //SocketObject.emitDrawObject(graphics);

    //SocketObject.emitObjectAddDone(graphics);
  };
}
