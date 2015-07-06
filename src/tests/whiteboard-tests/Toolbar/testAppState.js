var PIXI = require('../../../../app/js/vendor/pixi');
var io = require('../../../../app/js/vendor/socket.io');
var Whiteboard = require('../../../sections/Whiteboard/index');
var rectangle = require('../../../sections/Whiteboard/util/tools/rectangle');
var AppState = require('../../../model/AppState');

//var Canvas = document.createElement('canvas');
var renderer = new PIXI.CanvasRenderer(1000, 800, { antialias: true });
var stage = new PIXI.Stage(0xFFFFFF, true);

describe('AppState', function() {

  it('AppState should be defined', function() {
    expect(AppState).toBeDefined();
  })

  it('contains 6 properties', function() {
    expect(Object.keys(AppState).length).toEqual(6);
  })

  it('each of the main Object is defined', function() {
    for(var mainObject in AppState) {
      expect(AppState[mainObject]).toBeDefined();
    }
  })

  it('should have an init function', function() {
    expect(AppState.init).toBeDefined();
    expect({}.toString.call(AppState.init) === '[object Function]').toBe(true);
  })

  it('should instantiate stage and renderer, and attach socket to itself', function() {
    AppState.init(PIXI, {});
    expect(AppState.Canvas.stage).toBeDefined();
    expect(AppState.Canvas.renderer).toBeDefined();

    expect(AppState.Canvas.stage.children.length).toEqual(0);
    expect(AppState.Socket).toBeDefined();
  })

  it('should contain Shapes object', function() {
    expect(AppState.Canvas.Shapes).toBeDefined();
  })
})




