var PIXI = require('pixi');

module.exports = function(el, AppState) {
  var stage = AppState.Canvas.stage;
  var isDown = false;
  var prevPos = { x: null, y: null };
  var settings = {
    el: el,
    color: 0xFFFFFF,
    radius: 10
  };

  function mousedown(data) {
    isDown = true;
    prevPos.x = data.global.x;
    prevPos.y = data.global.y;
  }

  function mousemove(data) {
    var graphics;

    if(isDown) {
      interpolate(prevPos.x, prevPos.y, data.global.x, data.global.y);
      prevPos.x = data.global.x;
      prevPos.y = data.global.y;
    }
  }

  function interpolate(prevX, prevY, currX, currY) {
    var xIncrement = currX > prevX ? 10 : -10;
    var yIncrement = currY > prevY ? 10 : -10;

    while(Math.abs(currX - prevX) || Math.abs(currY - prevY)) {
      graphics = new PIXI.Graphics();
      graphics.beginFill(settings.color);
      graphics.drawCircle(prevX, prevY, settings.radius);
      graphics.endFill();
      stage.addChild(graphics);
      //renderer.render(stage);

      if(Math.abs(currX - prevX) > 10){
        prevX += xIncrement;
      } else {
        prevX = currX;
      }

      if(Math.abs(currY - prevY) > 10){
        prevY += yIncrement;
      } else {
        prevY = currY;
      }
    }
  }

  function mouseup() {
    isDown = false;
  }

  function mouseout(data) {
    isDown = false;
    graphics = undefined;
  }

  function activate(e) {
    e.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseout;

    return false;
  }

  el.addEventListener('click', activate);
};
