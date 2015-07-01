var PIXI = require('pixi');

module.exports = function(AppState, el) {
  var stage = AppState.Canvas.stage;
  var renderer = AppState.Canvas.renderer;
  var isDown = false;


  function mousedown(data) {
    isDown = true;

    console.log('Sent fill click event');
  }

  function mousemove(data) {

  }

  function mouseup(data) {
    isDown = false;

    //stage.setBackgroundColor(settings.color);
    //renderer.render(stage);
    //console.log(stage);
  }

  function activate() {
    AppState.Tools.selected = 'fill';
    var color = prompt('Enter a hex color without #:');
    // NOTE: we cannot do event delegation in PIXI as of yet,
    // since there is no event bubbling, instead we need to set mouse events on
    // all graphics objects directly...
    AppState.Tools.fill.fillColor = color || 0xFF0000;

    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;
  }

  el.addEventListener('click', activate);
};
