var PIXI = require('pixi');
var find = require('dom-select');
module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Color...');

    AppState.Tools.selected = 'color';

    selectPressed = true;
    activate(AppState.Canvas.stage,AppState.Canvas.renderer);
  });
};

function activate(stage, renderer) {
  var color = 0xCAFE00;
  var path = [];
  // var isActive = true;
  var isDown = false;
  var posOld;
  var stageIndex = 0;
  var lines = 0;
  var color = find('#color-picker canvas');
  var colorctx = color.getContext('2d');
 var gradient; 
  stage.mousedown = function(data) {
     gradient = colorctx.createLinearGradient(0,0,color.clientWidth,0);
     gradient.addColorStop(0,    "rgb(255,   0,   0)");
     gradient.addColorStop(0.15, "rgb(255,   0, 255)");
     gradient.addColorStop(0.33, "rgb(0,     0, 255)");
     gradient.addColorStop(0.49, "rgb(0,   255, 255)");
     gradient.addColorStop(0.67, "rgb(0,   255,   0)");
     gradient.addColorStop(0.84, "rgb(255, 255,   0)");
     gradient.addColorStop(1,    "rgb(255,   0,   0)");
     colorctx.fillStyle = gradient;
     colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);
     gradient = colorctx.createLinearGradient(0, 0, 0, color.clientHeight);
     gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
     gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
     gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
     gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
     colorctx.fillStyle = gradient;
     colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);
  };

  stage.mousemove = function(data) {

  };

  stage.mouseup = function() {
    isDown = false;

    if(!path.length) return;
    //graphics.lineStyle(5, color);
    //graphics.moveTo(path[0][0], path[0][1]);
    //graphics.drawPolygon(path);
    while(lines) {
      stage.removeChildAt(stageIndex + lines);
      lines--;
    }

    var graphics = new PIXI.Graphics().lineStyle(2, color);

    graphics.drawPolygon(path);

    graphics.interactive = true;

    graphics.hitArea = graphics.getBounds();

    // moveObject(renderer, stage, graphics, { x: graphics.hitArea.x, y: graphics.hitArea.y });

    stage.addChild(graphics);

    // CanvasObjects.push({
    //   _id: CanvasObjects.length + 1,
    //   type: 'pencil',
    //   coords: path
    // });

    //renderer.render(stage);
  };
}
