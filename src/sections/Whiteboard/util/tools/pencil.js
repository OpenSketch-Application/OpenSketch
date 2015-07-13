var PIXI = require('pixi');
var Pencil = require('../shapes/Pencil')
var EVENT = require('../../../../model/model').socketEvents;

module.exports = function(info, el, AppState) {
  var userID = info.userID;
  var stage = AppState.Canvas.stage;
  var socket = AppState.Socket;
  var shapes = AppState.Canvas.Shapes;
  var isDown = false;
  var prevPos = { x: null, y: null };
  var pencil;
  var path;
  var prevID;
  isFirst=false;

  var settings = {
    el: el,
    color: 0x000000,
    strokeWeight: 2
  };

  function mousedown(data) {
    isDown = true;
    isFirst = true;
    prevPos.x = data.global.x;
    prevPos.y = data.global.y;
    prevID = 0;
    path = [];
    path.push(prevPos.x);
    path.push(prevPos.y);

    pencil = new Pencil(AppState.Tools.pencil);
  }

  function mousemove(data) {
    if(isDown) {
      //Removing oldpath
      if(!isFirst)
        shapes.removeShapeByID(prevID);
      isFirst=false;

      var prevX = prevPos.x;
      var prevY = prevPos.y;

      prevPos.x = data.global.x;
      prevPos.y = data.global.y;
      path.push(prevPos.x);
      path.push(prevPos.y);
      pencil.draw({path: path});
      prevID = shapes.addNew(pencil)._id;
      console.log('movin');
      socket.emit(EVENT.shapeEvent,'add',pencil.getProperties());
    }
  }

  function mouseup() {
    //shapes.addNew(pencil);
    socket.emit(EVENT.saveObject,pencil.getProperties());

    isDown = false;
  }

  function mouseout(data) {

    isDown = false;
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
