var PIXI = require('pixi');

module.exports = function(info, el) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
  var isDown = false;
  var settings = {
    el: el,
    color: 0x000000,
    radius: 10
  };

  function mousedown(data) {
    isDown = true;

    //console.dir(data.target);
    var target = data.target;
    if(target.fillColor) {
      target.fillColor = settings.color;
      target.graphicsData[0].fillColor = settings.color;
    }
    //target.fillColor = target.
    //if(data)
  }

  function mousemove(data) {

  }

  function mouseup(data) {
    isDown = false;

    stage.setBackgroundColor(settings.color);
    //renderer.render(stage);
    //console.log(stage);
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
