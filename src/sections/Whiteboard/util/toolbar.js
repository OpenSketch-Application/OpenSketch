var find = require('dom-select');
var createSelect = require('./tools/select');
var createPencil = require('./tools/pencil');
var createEraser = require('./tools/eraser');
var createFill = require('./tools/fill');
var createLine = require('./tools/line');
var createRectangle = require('./tools/rectangle');

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
  //this.tools = {};
  this.socket = AppState.Socket;

  setDrawingSockets(AppState.Socket, AppState.Canvas.stage);

  //this.renderer.render(this.stage);

  // AppState.Canvas.stage
  // AppState.Canvas.renderer
  // var settings = {
  //   container: this.container,
  //   renderer: AppState.Canvas.renderer,
  //   stage: AppState.Canvas.stage,
  //   socket: AppState.socket
  // };

  console.log(elements.tools);

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ?
                     elements.tools[tool] : elements.tools[tool].el);
    imgs.push(el);
    console.log("tool:", tool);

    el.addEventListener('click', function(e) {
      this.className = 'tool-selected';

      console.log('Tool to highlight', this);
      // Store selected tool
      //_this.selectedTool = e.target.id;
      //AppState.Tools.toolSelected = e.target.id;

      //console.log(_this.selectedTool);

      imgs.forEach(function(img) {
        if(img !== this)
          img.className = "";
      }.bind(this));
    });

    switch(tool) {
      case 'select':
        //this.selectedTool = 'tool-select';
        createSelect(AppState, el);
        break;
      case 'pencil':
        createPencil(AppState, el);
        break;
      case 'eraser':
        this.eraser = createEraser(AppState, el);
        break;
      case 'fill':
        this.fill = el;
        createFill(AppState, el);
        break;
      case 'line':
        this.line = el;
        createLine(AppState, el);
        break;
      case 'ellipse':
        this.ellipse = el;
        //createShapes(AppState, el);
        break;
      case 'rectangle':
        this.rectangle = el;
        console.log('rect picked');
        createRectangle(AppState, el);
        break;
      case 'text':
        this.text = el;
        createText(AppState, el);
        break;
      case 'table':
        this.table = el;
        createTable(AppState, el);
        break;
      case 'import':
        this.import = el;
        createImport(AppState, el);
        break;
      case 'color':
        this.color = el;
        createColor(AppState, el);
        break;
      case 'templates':
        this.templates = el;
        createTemplates(AppState, el);
        break;
      default:
        break;
    }
  }

  //setDrawingSockets(this.stage,this.socket);
}
