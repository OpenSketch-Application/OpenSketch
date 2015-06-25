var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

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
  var rect;
  var stage = settings.stage;
  var renderer = settings.renderer;
  var socket = AppState.Socket;
  //var Shapes = AppState.Canvas.Shapes;
  var Canvas = AppState.Canvas;

  stage.mousedown = function(data) {
    isDown = true;
    data.originalEvent.preventDefault();
    //movingSelf = true;
    //this.data = data;
    originalCoords = data.getLocalPosition(this);

    //graphics = new PIXI.Graphics();
    rect = new Rect(AppState.Tools.rectangle);
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

      // graphics.clear();
      // graphics.interactive = false;
      // graphics.beginFill(0xFFFFFF); // style.fillColor
      // graphics.lineWidth = 2; // style.lineWidth
      // graphics.lineColor = 0x000000; // style.lineColor



      // //console.log(originalCoords);

      var width = localPos.x - originalCoords.x;
      var height = localPos.y - originalCoords.y;

      // Ensure height and width are positive
      if(width < 0) width *= -1;
      if(height < 0) height *= -1;

      topLeft.x = Math.min(originalCoords.x, localPos.x);
      topLeft.y = Math.min(localPos.y, originalCoords.y);

      rect.draw({
        x: topLeft.x,
        y: topLeft.y,
        width: width,
        height: height
      }, AppState.Canvas.stage);

      // //spriteGraphics = graphics;

      // stage.addChild(graphics);

      // graphics.drawRect(
      //   0,
      //   0,
      //   newDimensions.width,
      //   newDimensions.height
      // );

      // spriteGraphics = new PIXI.Sprite(graphics.generateTexture());
      // spriteGraphics.position.x = topLeft.x;
      // spriteGraphics.position.y = topLeft.y;

      //finalGraphics = Rect.makeRect(topLeft, newDimensions, settings);
      //stage.addChild(spriteGraphics);
      //graphics = null;
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
      //shapeObject = Canvas.addNew('rectangle', graphics);
      rect.addNew(AppState.Canvas.Shapes);
      socket.emit(EVENT.sendRect, 'add', { rect: 'some Info' } );

      //setMoveShapeListeners(graphics, shapeObject, AppState);
      //graphics.interactive = true;
      //graphics = null;
      rect = null;
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
