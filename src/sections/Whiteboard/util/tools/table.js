var PIXI = require('pixi');

module.exports = function(settings, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Table...');

    selectPressed = true;
    activate(settings.stage, settings.renderer);
  });
};

function activate(stage, renderer) {
  var color = 0xF93FAF;
  // var isActive = true;
  var isDown = false;
  var posOld;
  var stageIndex = 0;
  var lines = 0;
  var rows = prompt('Number of rows!');
  var cols = prompt('Number of cols!');
  var graphics;
  var origin = {};
  stage.mousedown = function(data) {
    graphics = new PIXI.Graphics().lineStyle(2, color);
    origin = data.getLocalPosition(this);
    //if(!isActive) return;
    isDown = true;
    lines = 0;
    stageIndex = stage.children.length - 1;
    //graphics.moveTo(data.global.x, data.global.y);
  };

  stage.mousemove = function(data) {
    //if(!isActive) return;
    if(!isDown) return;
    graphics.clear();
    graphics = new PIXI.Graphics().lineStyle(2, color);
    graphics.interactive = false;
    graphics.beginFill(0xFFFFFF); 
    var pos = data.getLocalPosition(this);
    var width = pos.x - origin.x;
    var height = pos.y - origin.y;
    graphics.drawRect(origin.x,origin.y,width,height );
    var x = origin.x;
    var y = origin.y;
    for(var i = 1; i<rows;i++){
      graphics.moveTo(x + width/rows,y);
      graphics.lineTo(x + width/rows ,y +height);
      x = x +=width/rows;
    }
    x = origin.x;
    y = origin.y;
    for(var i = 1; i<cols;i++){
      graphics.moveTo(x,y+ height/cols);
      graphics.lineTo(x+ width,y +height/cols);
      y = y +=height/cols;
    }

        stage.addChild(graphics);
 
    //renderer.render(stage);
  };

  stage.mouseup = function() {
    isDown = false;


    graphics.interactive = true;

    //graphics.hitArea = graphics.getBounds();

    // moveObject(renderer, stage, graphics, { x: graphics.hitArea.x, y: graphics.hitArea.y });

//    stage.addChild(graphics);

    // CanvasObjects.push({
    //   _id: CanvasObjects.length + 1,
    //   type: 'pencil',
    //   coords: path
    // });

    //renderer.render(stage);
  };
}
