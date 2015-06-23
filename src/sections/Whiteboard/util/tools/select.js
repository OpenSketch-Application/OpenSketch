var PIXI = require('pixi');

module.exports = function(settings, el, AppState) {
  // var selected = false;
  // var original;
  // var _this = this;
  el.addEventListener('click', function(e) {
    console.log('click fired');
    AppState.Tools.selected = 'select';
    return activate(settings.stage, settings.renderer, AppState);
  })

}

// Return true for now, might decide to implement more complexity for
// complex shapes
function activate(stage, renderer, AppState) {

  stage.mousedown = null;
  stage.mousemove = null;
  stage.mouseup = null;

  return true;
}
