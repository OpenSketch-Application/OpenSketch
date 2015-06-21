var PIXI = require('pixi');

module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Text...');

    AppState.Tools.toolSelected = AppState.Tools.text;

    selectPressed = true;
    activate(AppState.Canvas.stage, AppState.Canvas.renderer, AppState.Tools.text, AppState.Shapes);
  });
};

function activate(stage, renderer, TextTool, Shapes) {
  var path = [];
  // var isActive = true;
  var isDown = false;
  var posOld;
  var stageIndex = 0;
  var lines = 0;
  var graphics;
  console.log(Shapes);

  stage.mousedown = function(data) {

    isDown = true;
    lines = 0;
    path = [];
    posOld = [data.global.x, data.global.y];
    path.push(posOld[0],posOld[1]);
    //stageIndex = stage.children.length - 1;
    graphics = new PIXI.Graphics().lineStyle(2, TextTool.fontColor);

  };

  stage.mousemove = function(data) {
    //if(!isActive) return;
    if(isDown) {
      //path.push(data.global.y);
      //var newPosition = this.data.getLocalPosition(this.parent);
      //graphics.clear();
      graphics.moveTo(posOld[0], posOld[1]);
      //console.log(data.global.x, data.global.y);
      graphics.lineTo(data.global.x, data.global.y);

      posOld[0] = data.global.x;
      posOld[1] = data.global.y;

      path.push(posOld[0],posOld[1]);

      //lines++;
      stage.addChild(graphics);
    }
  };

  stage.mouseup = function() {
    isDown = false;


    Shapes.addNew();
  };

  stage.mouseout = function() {
    isDown = false;
  }
}
