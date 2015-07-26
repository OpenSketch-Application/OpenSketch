var PIXI = require('pixi');

module.exports = function(el, AppState) {
  el.addEventListener('click', function(data) {
    data.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    console.log('Selected Color...');

    AppState.Tools.selected = 'color';

    selectPressed = true;

    return false;
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

  stage.mousedown = function(data) {

    //if(!isActive) return;
    isDown = true;
    lines = 0;
    path = [];
    posOld = [data.global.x, data.global.y];
    path.push(posOld[0],posOld[1]);
    stageIndex = stage.children.length - 1;
    //graphics.moveTo(data.global.x, data.global.y);
  };

  stage.mousemove = function(data) {
    //if(!isActive) return;
    if(!isDown) return;
    var graphics = new PIXI.Graphics().lineStyle(2, color);
    //path.push(data.global.y);
    //var newPosition = this.data.getLocalPosition(this.parent);
    graphics.moveTo(posOld[0], posOld[1]);
    //console.log(data.global.x, data.global.y);
    graphics.lineTo(data.global.x, data.global.y);
    posOld = [data.global.x, data.global.y];
    path.push(posOld[0],posOld[1]);
    lines++;
    stage.addChild(graphics);

    //renderer.render(stage);
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
