var PIXI = require('pixi');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected pencil...', AppState);

    AppState.Tools.toolSelected = AppState.Tools.pencil;

    //if(settings.toolbar.toolSelected) return; // Return early if toolbar Select was picked

    activate(AppState.Canvas.stage, AppState.Canvas.renderer, AppState.Socket, AppState.Tools.pencil);
  });
};

// var userID = info.userID;

function activate(stage, renderer, socket, PencilTool) {
  var isDown = false;
  var prevPos = { x: null, y: null };
  var settings = {
    color: 0x000000,
    strokeWeight: 2
  };

  stage.mousedown = function(data) {
    isDown = true;
    prevPos.x = data.global.x;
    prevPos.y = data.global.y;
  }

  stage.mousemove = function(data) {
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

      socket.emit(EVENT.sendPencil,shapeinfo);
    }
  }

  stage.mouseup = function() {
    isDown = false;
  }
}

