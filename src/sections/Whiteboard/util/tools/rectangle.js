var PIXI = require('pixi');
var Rect = require('../shapes/Rectangle');
var setMoveShapeListeners = require('./shapeHelpers/setMoveShapeListeners');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(settings, el, AppState) {
  el.addEventListener('click', function(data) {
    console.log('Selected Shapes...');
    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    //Rect.set(settings.stage, settings.renderer);
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
  var socket = settings.socket;

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
    drawBegan = false;
    isDown = false;
    movingSelf = false;
    graphics.interactive = true;


    // set move Mouse Events on the final shape created
    setMoveShapeListeners(graphics, settings, AppState);
    var loc = data.getLocalPosition(this);
    width = loc.x - originalCoords.x;
    height = loc.y - originalCoords.y;

    var shape = 
      {
        x: originalCoords.x,
        y: originalCoords.y,
        w: width,
        h: height,
        strokeWeight:graphics.lineWidth,
        color: graphics.lineColor,
        type: 'rectangle'
      };

     socket.emit(EVENT.sendObject,shape);
     socket.emit(EVENT.saveObject,shape);

    //graphics = null;
    //var graphics = new PIXI.Graphics();
    //SocketObject.emitDrawObject(finalGraphics);
    //SocketObject.emitObjectAddDone(finalGraphics);
  };

  // stage.mouseout = function(data) {
  //   isDown = false;
  // }
}
