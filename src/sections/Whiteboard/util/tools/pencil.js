var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(info, el, AppState) {
  var userID = info.userID;
  var stage = info.stage;
  var renderer = info.renderer;
  var isDown = false;
  var prevPos = { x: null, y: null };
  var graphics;

  var settings = {
    el: el,
    color: 0x000000,
    strokeWeight: 2
  };

  function mousedown(data) {
    isDown = true;

    prevPos.x = data.global.x;
    prevPos.y = data.global.y;

    graphics = new PIXI.Graphics();
  }

  function mousemove(data) {
    if(isDown) {
      graphics.lineStyle(settings.strokeWeight, settings.color)
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
    if(isDown) AppState.Canvas.addNew('pencil', graphics);

    isDown = false;
  }

  function mouseout(data) {
    if(isDown) AppState.Canvas.addNew('pencil', graphics);

    isDown = false;
    graphics = undefined;
  }

  function activate() {
    AppState.Tools.selected = 'pencil';
    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
    stage.mouseout = mouseout;
  }

  el.addEventListener('click', activate);

  return settings;
};
