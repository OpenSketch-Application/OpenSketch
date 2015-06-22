var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');

module.exports = function(settings, el, AppState) {
  el.addEventListener('click', function(data) {
    console.log('Selected Shapes...');
    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    // Set the selected tool on AppState
    AppState.Tools.selected = 'rectangle';

    //Rect.set(settings.stage, settings.renderer);
    activate(settings, AppState);
  });
};

function activate(settings, AppState) {
  // var isActive = true;
  var isDown = false;
  var originalCoords;
  var drawBegan = false;
  var graphics;
  var stage = settings.stage;
  var renderer = settings.renderer;
  //var Shapes = AppState.Canvas.Shapes;
  var Canvas = AppState.Canvas;


  stage.mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    movingSelf = true;
    this.data = data;
    originalCoords = data.getLocalPosition(this);
    graphics = new PIXI.Graphics();
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

    console.log("drawing");
  };

  stage.mousemove = function(data) {
    if(isDown) {
      var localPos = data.getLocalPosition(this);
      var topLeft = {};

      graphics.clear();
      graphics.interactive = false;
      graphics.beginFill(0xFFFFFF); // style.fillColor
      graphics.lineWidth = 2; // style.lineWidth
      graphics.lineColor = 0x000000; // style.lineColor

      //console.log(originalCoords);

      var newDimensions = {
        width: localPos.x - originalCoords.x,
        height: localPos.y - originalCoords.y
      };

      // Ensure height and width are positive
      if(newDimensions.width < 0) newDimensions.width *= -1;
      if(newDimensions.height < 0) newDimensions.height *= -1;

      topLeft.x = Math.min(originalCoords.x, localPos.x);
      topLeft.y = Math.min(localPos.y, originalCoords.y);

      graphics.drawRect(
        topLeft.x,
        topLeft.y,
        newDimensions.width,
        newDimensions.height
      );

      //finalGraphics = Rect.makeRect(topLeft, newDimensions, settings);
      stage.addChild(graphics);


      //SocketObject.emitDrawingObject(finalGraphics);
      drawBegan = true;
    }
  };

  stage.mouseup = function(data) {
    var shapeObject;

    // Flag that tells us that mouse button was pressed down before
    if(isDown) {
      // layerLevel: stage.children.length,
      // x: graphics.x,
      // y: graphics.y,
      // width: graphics.width,
      // height: graphics.height,
      // fillColor: graphics.lineColor,
      // rotation: graphics.rotation,
      // borderWidth: graphics.lineWidth,
      // borderColor: graphics.lineColor,
      // objectType: 'rectangle',
      // userId: 'wooMee',
      // canvasID: 'session42'
      shapeObject = Canvas.addNew('rectangle', graphics);

      setMoveShapeListeners(graphics, shapeObject, AppState);

      graphics.interactive = true;
    }

    drawBegan = false;
    isDown = false;
    movingSelf = false;


    // set move Mouse Events on the final shape created

    //graphics = null;
    //var graphics = new PIXI.Graphics();
    //SocketObject.emitDrawObject(finalGraphics);
    //SocketObject.emitObjectAddDone(finalGraphics);
  };
  // stage.mouseout = function(data) {
  //   isDown = false;
  // }
}
