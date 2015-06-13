var PIXI = require('pixi');

module.exports = function(settings, el) {
  el.addEventListener('click', function(data) {
    console.log("pencil selected");

    selectPressed = true;
    activatePencil(settings.stage, settings.renderer);
    //drawRect();
  });
};

function activatePencil(stage, renderer) {
console.log('activating pencil...');

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
      var graphics = new PIXI.Graphics().lineStyle(1, 0xFF0000);
      //path.push(data.global.y);
      //var newPosition = this.data.getLocalPosition(this.parent);
      graphics.moveTo(posOld[0], posOld[1]);
      //console.log(data.global.x, data.global.y);
      graphics.lineTo(data.global.x, data.global.y);
      posOld = [data.global.x, data.global.y];
      path.push(posOld[0],posOld[1]);
      lines++;
      stage.addChild(graphics);

      renderer.render(stage);
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

      var graphics = new PIXI.Graphics().lineStyle(2, 0xFF0000);

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

      renderer.render(stage);
    };
  }

  function moveObject(renderer, stage, graphics, inverse) {
    var selected = false;
    var orginial;

    graphics.mousedown = graphics.touchstart = function(data)
    {
      if(!selectPressed) return;
      data.originalEvent.preventDefault();

      this.data = data;
      orginial = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;
      renderer.render(stage);
      //console.log(data.getLocalPosition(obj));
      //obj.position = obj.toLocal(data.getLocalPosition(obj));
      // obj.y += 20;
    };

    graphics.mousemove = function(data)
    {
      if(selected) {
        var newPosition = this.data.getLocalPosition(this.parent);

        //if(inverse) {
          // this.position.x = orginial.x - newPosition.x;
          // this.position.y = orginial.y - newPosition.y;
        //}
        // else {
          this.position.x = newPosition.x - orginial.x;
          this.position.y = newPosition.y - orginial.y;
        // }

        //this.position = newPosition;
        //console.log(this.data.global.x, this.data.global.y);
        renderer.render(stage);
      }
    };

    graphics.mouseup = graphics.mouseupoutside = graphics.touchend = graphics.touchendoutside = function(data) {
      if(!selectPressed) return;
      selected = false;
      this.alpha = 1;
      //this.dragging = false;

      // set the interaction data to null
      this.data = null;
      renderer.render(stage);
    };
  }