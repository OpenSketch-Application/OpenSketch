var PIXI = require('pixi');

module.exports = function(info, el) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
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

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseout;
  }

  el.addEventListener('click', activate);

  return settings;
};
