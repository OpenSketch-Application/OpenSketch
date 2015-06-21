var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log(el);
    console.log('Selected Rectangle...');

    Rect.set(AppState.Canvas.stage, AppState.Canvas.renderer);

    activate(AppState);
  });
};

function activate(AppState) {
  // var isActive = true;
  var isDown = false;
  var originalCoords;
  var curStageIndex = 0;
  var drawBegan = false;
  var finalGraphics;
  var inverse;
  var stage = AppState.Canvas.stage;
  var renderer = AppState.Canvas.renderer;

  stage.mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    movingSelf = true;
    this.data = data;
    originalCoords = data.getLocalPosition(this);
    //finalGraphics = new PIXI.Graphics();

    //curStageIndex = stage.children.length;

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

    //console.log("drawing");
  };

  stage.mousemove = function(data) {
    if(isDown) {
      var localPos = data.getLocalPosition(this);
      var topLeft = {};


      //console.log(originalCoords);
      //console.log(finalGraphics);

      var newDimensions = {
        width: localPos.x - originalCoords.x,
        height: localPos.y - originalCoords.y
      };

      // Ensure height and width are positive
      if(newDimensions.width < 0) newDimensions.width *= -1;
      if(newDimensions.height < 0) newDimensions.height *= -1;

      topLeft.x = Math.min(originalCoords.x, localPos.x);
      topLeft.y = Math.min(localPos.y, originalCoords.y);

      if(finalGraphics) {
        stage.removeChild(finalGraphics);
      }

      finalGraphics = Rect.makeRect(topLeft, newDimensions, AppState);
      stage.addChild(finalGraphics);

      finalGraphics.objectAdded = drawBegan;

      //SocketObject.emitDrawingObject(finalGraphics);

      drawBegan = true;
    }
  };

  stage.mouseup = function(data) {
    drawBegan = false;
    isDown = false;
    movingSelf = false;

    if(finalGraphics) {
      // set move Mouse Events on the final shape created
      setMoveShapeListeners(finalGraphics, AppState.Tools);
    }

    finalGraphics = null;
    // var graphics = new PIXI.Graphics();
    //SocketObject.emitDrawObject(finalGraphics);

    //SocketObject.emitObjectAddDone(finalGraphics);
  };
}
