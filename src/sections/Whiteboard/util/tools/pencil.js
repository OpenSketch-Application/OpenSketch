var PIXI = require('pixi');

module.exports = function(info, el) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
  var color = 0x000000;
  var strokeWeight = 2;
  var isDown = false;
  var prevPos = { x: null, y: null };
  var settings = {
    el: el,
    color: color,
    strokeWeight: strokeWeight
  };

  function mousedown(data) {
    isDown = true;
    prevPos.x = data.global.x;
    prevPos.y = data.global.y;
  }

  function mousemove(data) {
    var graphics;

    if(isDown) {
      graphics = new PIXI.Graphics().lineStyle(strokeWeight, color);
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
    color = "0x" + prompt("Enter a hex color without #");
    strokeWeight = prompt("Enter a stroke weight") || 2;
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
  }

  el.addEventListener('click', activate);

  return settings;
};
