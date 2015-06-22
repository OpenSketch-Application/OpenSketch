var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

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
      var prevX = prevPos.x;
      var prevY = prevPos.y;

      graphics.lineTo(data.global.x, data.global.y);
      prevPos.x = data.global.x;
      prevPos.y = data.global.y;
      stage.addChild(graphics);

      var shapeinfo = {
        x1: prevX,
        y1: prevY,
        x2: data.global.x,
        y2: data.global.y,
        color: settings.color,
        strokeWeight: settings.strokeWeight
      };
      info.socket.emit(EVENT.sendPencil,shapeinfo);
      //renderer.render(stage);
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
