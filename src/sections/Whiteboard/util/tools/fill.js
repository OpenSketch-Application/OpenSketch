var PIXI = require('pixi');

module.exports = function(el, AppState) {
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

  function activate(e) {
    e.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    AppState.Tools.selected = 'fill';
    var color = prompt('Enter a hex color without #:');
    // NOTE: we cannot do event delegation in PIXI as of yet,
    // since there is no event bubbling, instead we need to set mouse events on
    // all graphics objects directly...
    AppState.Tools.fill.fillColor = color || 0xFF0000;

    stage.mousedown = mousedown;
    stage.mousemove = mousemove;
    stage.mouseup = mouseup;

    return false;
  }

  el.addEventListener('click', activate);
};
