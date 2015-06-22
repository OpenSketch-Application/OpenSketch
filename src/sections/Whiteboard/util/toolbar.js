var PIXI = require('pixi');
var find = require('dom-select');
var createSelect = require('./tools/select');
var createPencil = require('./tools/pencil');
var createEraser = require('./tools/eraser');
var createFill = require('./tools/fill');
var createLine = require('./tools/line');
var createRectangle = require('./tools/rectangle');

var createEllipse = require('./tools/ellipse');
var createText = require('./tools/text');
var createTable = require('./tools/table');
var createImport = require('./tools/import');
var createColor = require('./tools/color');
var createTemplates = require('./tools/templates');
var setDrawingSockets = require('./drawingSockets');

var dragndrop = require('./dragndrop');

module.exports = toolbar;

function toolbar(elements, AppState) {
  var el;
  var imgs = [];
  var _this = this;
  this.tools = {};
  this.container = find(elements.whiteboard);
  this.socket = AppState.Socket;
  PIXI.dontSayHello = true;

  this.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,
                                          document.body.offsetHeight - 60,
                                          { antialias: true });

  this.container.appendChild(this.renderer.view);
  this.stage = new PIXI.Stage(0xFFFFFF, true);

  AppState.Canvas.stage = this.stage;
  AppState.Canvas.renderer = this.renderer;

  animate();

  setDrawingSockets(_this.socket,_this.stage);

  function animate() {
    requestAnimFrame(animate);
    _this.renderer.render(_this.stage);
  }


  // AppState.Canvas.Tools
  //var settings = AppState.Canvas.Tools;
  var settings = {
    container: this.container,
    renderer: this.renderer,
    stage: this.stage,
    socket: this.socket,
    //selectedTool: this.selectedTool
    selectedTool: function() {
      return _this.selectedTool;
    }
  };

  dragndrop(settings, AppState);

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ?
                     elements.tools[tool] : elements.tools[tool].el);
    imgs.push(el);

    el.addEventListener('click', function(e) {
      this.className = 'tool-selected';
      console.log(el);

      // Store selected tool
      _this.selectedTool = e.target.id;

      imgs.forEach(function(img) {
        if(img !== this)
          img.className = "";
      }.bind(this));
    });

    switch(tool) {
      case 'select':
        //this.selectedTool = 'tool-select';
        createSelect(settings, el, AppState);
        break;
      case 'pencil':
        this.pencil = el;
        createPencil(settings, el, AppState);
        break;
      case 'eraser':
        this.eraser = el;
        this.eraser = createEraser(settings, el, AppState);
        break;
      case 'fill':
        this.fill = el;
        createFill(settings, el, AppState);
        break;
      case 'line':
        this.line = el;
        createLine(settings, el, AppState);
        break;
      case 'ellipse':
        this.ellipse = el;
        createEllipse(settings, el, AppState);
        break;
      case 'rectangle':
        this.rectangle = el;
        createRectangle(settings, el, AppState);
        break;
      case 'text':
        this.text = el;
        createText(settings, el, AppState);
        break;
      case 'table':
        this.table = el;
        createTable(settings, el, AppState);
        break;
      case 'import':
        this.import = el;
        //settings, el, AppState
        createImport(settings, el, AppState);
        break;
      case 'color':
        this.color = el;
        createColor(settings, el, AppState);
        break;
      case 'templates':
        this.templates = el;
        createTemplates(settings, el, AppState);
        break;
      default:
        break;
    }
  }
}
