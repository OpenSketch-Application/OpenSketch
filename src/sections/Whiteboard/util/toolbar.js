var PIXI = require('pixi');
var find = require('dom-select');
var createSelect = require('./tools/select');
var createPencil = require('./tools/pencil');
var createEraser = require('./tools/eraser');
var createFill = require('./tools/fill');
var createLine = require('./tools/line');
var createRectangle = require('./tools/rectangle');

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
  this.socket = AppState.Socket;
  PIXI.dontSayHello = true;

  AppState.Canvas.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,
                                          document.body.offsetHeight - 60,
                                          { antialias: true });

  this.container.appendChild(AppState.Canvas.renderer.view);
  AppState.Canvas.stage = new PIXI.Stage(0xFFFFFF, true);
  animate();
  setDrawingSockets(AppState.Socket, AppState.Canvas.stage);

  function animate() {
    requestAnimFrame(animate);
    AppState.Canvas.renderer.render(AppState.Canvas.stage);
    //this.renderer.render(this.stage);
  }
  //this.renderer.render(this.stage);

  // AppState.Canvas.stage
  // AppState.Canvas.renderer
  var settings = {
    container: this.container,
    renderer: AppState.Canvas.renderer,
    stage: AppState.Canvas.stage,
    socket: AppState.socket
    //selectedTool: this.selectedTool
    // selectedTool: function() {
    //   return _this.selectedTool;
    // }
  };
  console.log(elements.tools);

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ?
                     elements.tools[tool] : elements.tools[tool].el);
    imgs.push(el);
    console.log("tool:", tool);

    el.addEventListener('click', function(e) {
      this.className = 'tool-selected';


      // Store selected tool
      //_this.selectedTool = e.target.id;
      AppState.Tools.selected = e.target.id;

      //console.log(_this.selectedTool);

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
        console.log('rect picked');
        createRectangle(AppState, el);
        break;
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
