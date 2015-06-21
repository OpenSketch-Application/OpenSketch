var PIXI = require('pixi');

module.exports = function(AppState, el) {
  // var selected = false;
  // var original;
  // var _this = this;
  el.addEventListener('click', function(e) {
    console.log('click fired');

    // Set selected tool as reference
    AppState.Tools.toolSelected = AppState.Tool.select;
    activate(AppState.Canvas.stage, AppState.Canvas.stage, AppState.Tool.select);
  })
}

// Return true for now, might decide to implement more complexity for
// complex shapes
function activate(stage, renderer, selectTool) {

  stage.mousedown = null;
  stage.mousemove = null;
  stage.mouseup = null;
}

function mouseDown(data) {
  console.log(data);
  console.log(data.target);
  //AppState.Tool.select
}
