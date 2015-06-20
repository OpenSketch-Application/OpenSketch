var PIXI = require('pixi');
var find = require('dom-select');
var createSelect = require('./tools/select');
var createPencil = require('./tools/pencil');
var createEraser = require('./tools/eraser');
var createFill = require('./tools/fill');
var createLine = require('./tools/line');
var createShapes = require('./tools/shapes');

//var createRect = require()
var createText = require('./tools/text');
var createTable = require('./tools/table');
var createImport = require('./tools/import');
var createColor = require('./tools/color');
var createTemplates = require('./tools/templates');
var setDrawingSockets = require('./drawingSockets');
module.exports = toolbar;

function toolbar(elements, AppState) {

  var el;
  var imgs = [];
  var _this = this;
  this.tools = {};
  this.container = find(elements.whiteboard);
  this.socket = socket;
  PIXI.dontSayHello = true;

  this.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,
                                          document.body.offsetHeight - 60,
                                          { antialias: true });

  this.container.appendChild(this.renderer.view);
  _this.stage = new PIXI.Stage(0xFFFFFF, true);
  animate();
  setDrawingSockets(socket,_this.stage);


  function animate() {
    requestAnimFrame(animate);
    _this.renderer.render(_this.stage);
    //this.renderer.render(this.stage);
  }
  //this.renderer.render(this.stage);

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
        createSelect(settings, el);
        break;
      case 'pencil':
        this.pencil = createPencil(settings, el);
        break;
      case 'eraser':
        this.eraser = createEraser(settings, el);
        break;
      case 'fill':
        this.fill = el;
        createFill(settings, el);
        break;
      case 'line':
        this.line = el;
        createLine(settings, el);
        break;
      case 'ellipse':
        this.ellipse = el;
        //createShapes(settings, el);
        break;
      case 'rectangle':
        this.rectangle = el;
        createShapes(settings, el);
      case 'text':
        this.text = el;
        createText(settings, el);
        break;
      case 'table':
        this.table = el;
        createTable(settings, el);
        break;
      case 'import':
        this.import = el;
        createImport(settings, el);
        break;
      case 'color':
        this.color = el;
        createColor(settings, el);
        break;
      case 'templates':
        this.templates = el;
        createTemplates(settings, el);
        break;
      default:
        break;
    }
  }

  //setDrawingSockets(this.stage,this.socket);
}
