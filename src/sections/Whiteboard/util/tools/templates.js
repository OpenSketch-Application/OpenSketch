var PIXI = require('pixi');

module.exports = function(settings, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Templates...');

    selectPressed = true;
    activate(settings.stage, settings.renderer);
  });
};

function activate(stage, renderer) {
  var color = 0xE0A0D1;
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
    //graphics.lineStyle(5, 0xFF0000);
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
