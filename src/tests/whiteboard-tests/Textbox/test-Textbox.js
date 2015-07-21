var PIXI = require('../../../../app/js/vendor/pixi');
var io = require('../../../../app/js/vendor/socket.io');
//var Whiteboard = require('../../../sections/Whiteboard/index');
var rectangle = require('../../../sections/Whiteboard/util/tools/rectangle');
var AppState = require('../../../model/AppState');

//var Canvas = document.createElement('canvas');
var renderer = new PIXI.CanvasRenderer(1000, 800, { antialias: true });
var stage = new PIXI.Stage(0xFFFFFF, true);
//var text = require('../../../sections/Whiteboard/util/tools/text');
var line = require('../../../sections/Whiteboard/util/tools/line');
//var Textbox = require('../../../sections/Whiteboard/util/shapes/Text');

describe('Textbox', function() {

  it('AppState should be defined', function() {
    expect(AppState).toBeDefined();
  })

  // it('Textbox should be defined', function() {
  //   expect(Textbox).toBeDefined();
  // })

  // it('', function() {
  //   expect
  // })

});
