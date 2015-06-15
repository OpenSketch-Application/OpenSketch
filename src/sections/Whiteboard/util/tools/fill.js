var PIXI = require('pixi');

module.exports = function(info, el) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
  var isDown = false;
  var settings = {
    el: el,
    color: 0xFFFFFF,
    radius: 10
  };

  function mousedown(data) {
    isDown = true;
  }

  function mousemove(data) {
  }

  function mouseup() {
    isDown = false;
    stage.setBackgroundColor(settings.color);
    renderer.render(stage);
    console.log(stage);
  }

  function activate() {
    settings.color = prompt('Enter a hex color without #:');
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
  }

  el.addEventListener('click', activate);

  return settings;
};
