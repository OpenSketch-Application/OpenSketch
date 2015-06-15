var PIXI = require('pixi');

module.exports = function(info, el) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
  var isDown = false;
  var prevPos = { x: null, y: null };
  
  var settings = {
    el: el,
    color: 0x000000,
    strokeWeight: 2
  };

  function mousedown(data) {
    isDown = true;
    prevPos.x = data.global.x;
    prevPos.y = data.global.y;
  }

  function mousemove(data) {
    var graphics;

    if(isDown) {
      graphics = new PIXI.Graphics().lineStyle(settings.strokeWeight, settings.color);
      graphics.moveTo(prevPos.x, prevPos.y);
      graphics.lineTo(data.global.x, data.global.y);
      prevPos.x = data.global.x;
      prevPos.y = data.global.y;
      stage.addChild(graphics);
      renderer.render(stage);
    }
  }

  function mouseup() {
    isDown = false;
  }

  function activate() {
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
  }

  el.addEventListener('click', activate);

  return settings;
};
