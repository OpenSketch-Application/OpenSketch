var PIXI = require('pixi');

module.exports = function(AppState, el) {
  // var selected = false;
  // var original;
  // var _this = this;
  el.addEventListener('click', function(e) {
    console.log('click fired');
    AppState.Tools.selected = 'select';
    activate(AppState.Canvas.stage, AppState.Canvas.renderer, AppState);
  })

}

// Return true for now, might decide to implement more complexity for
// complex shapes
function activate(stage, renderer, AppState) {

  stage.mousedown = function(data) {
    // Fire off selected ObjectId to server
    //AppState.Socket.emit();
  };
  stage.mousemove = null;
  stage.mouseup = null;

  return true;
}
