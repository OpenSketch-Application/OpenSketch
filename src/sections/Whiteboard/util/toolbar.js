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
  var toolbox = find('#header ul.toolbar');
  var previouslySelected; // Only for toolbar HTML UI functionality

  this.tools = {};
  this.container = find(elements.whiteboard);

  // NEED TO GET RID OF THIS
  var settings = {
    container: this.container,
    renderer: AppState.Canvas.renderer,
    stage: AppState.Canvas.stage,
    socket: AppState.Socket,
    selectedTool: function() {
      return _this.selectedTool;
    }
  };

  // Main drawing socket events
  setDrawingSockets(AppState);

  // Enables drag N drop functionality for Canvas images
  dragndrop(AppState);

  // Need to fix Shapes selection state
  toolbox.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    _this.selectedTool = e.target.id;
    var button = e.target;

    console.log(button);

    if(previouslySelected) {
      previouslySelected.className = "";
    }
    if(button)
    button.className = "tool-selected";
    previouslySelected = button;

  }, false);


  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ?
                     elements.tools[tool] : elements.tools[tool].el);

    switch(tool) {
      case 'select':
        //this.selectedTool = 'tool-select';
        createSelect(AppState, el);
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
        createFill(AppState, el);
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
