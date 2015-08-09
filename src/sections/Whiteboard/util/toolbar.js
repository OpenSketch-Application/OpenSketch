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

var EVENT = require('../../../model/model').socketEvents;
var dragndrop = require('./dragndrop');

module.exports = toolbar;

function toolbar(elements, AppState) {
  var el;
  var imgs = [];
  var _this = this;
  var toolbox = find('#header ul.toolbar');
  var previouslySelected; // Only for toolbar HTML UI functionality

  var tools = AppState.Tools;
  var socket = AppState.Socket;
  var stage = AppState.Canvas.stage;

  this.container = find(elements.whiteboard);

  // Used to store the ToolBox Tools that can be selected
  this.toolButtons = {};

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

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ?
                     elements.tools[tool] : elements.tools[tool].el);

    this.toolButtons[tool] = el;

    switch(tool) {
      case 'select':
        createSelect(AppState, el);
        break;
      case 'pencil':
        createPencil(settings, el, AppState);
        break;
      case 'eraser':
        this.eraser = createEraser(el, AppState);
        break;
      case 'fill':
        createFill(el, AppState);
        break;
      case 'line':
        createLine(el, AppState);
        break;
      case 'ellipse':
        createEllipse(el, AppState);
        break;
      case 'rectangle':
        createRectangle(el, AppState);
        break;
      case 'text':
        createText(el, AppState);
        break;
      case 'table':
        createTable(settings, el, AppState);
        break;
      case 'import':
        createImport(el, AppState);
        break;
      case 'color':
        createColor(el, AppState);
        break;
      case 'templates':
        createTemplates(el, AppState);
        break;
      default:
        break;
    }
  }

  this.addUserInteraction = function() {
    AppState.Settings.interactive = true;

    stage.interactive = true;

    toolbox.addEventListener('click', this.addToolbarShapeHandlers, false);

    // // Enables drag N drop functionality for Canvas images
    // dragndrop(AppState);
  }

  this.addToolbarShapeHandlers = function(e) {
    //e.preventDefault();
    //e.stopPropagation();
    stage.interactive = true;

    _this.selectedTool = e.target.id;
    var button = e.target;

    if(previouslySelected) {
      previouslySelected.className = "";
    }

    if(tools && tools.select.selectedObject) {
      // Unhighlight the tool User has selected
      tools.select.selectedObject.unHighlight();

      // Shape from being locked when User selects a tool
      socket.emit(EVENT.shapeEvent, 'unlockShape', {
        _id: tools.select.selectedObject._id
      });
    }

    if(button && button.tagName === 'IMG') {
      button.className = "tool-selected";
      previouslySelected = button;

      if(tools && tools.selected) {
        AppState.ShapeAttributeEditor.editShapeAttributes(tools[tools.selected], tools.selected);
      }
    }
  }

  // Will prevent User from Interacting with Toolbar
  this.removeUserInteraction = function() {

    // Disables all interaction with Canvas
    AppState.Settings.interactive = false;

    toolbox.removeEventListener('click', this.addToolbarShapeHandlers, false);

    if(previouslySelected) {
      previouslySelected.className = "";
    }

    stage.interactive = false;

    tools.selected = '';

    stage.mousedown = function(data){ data.originalEvent.preventDefault() };
    stage.mouseup = function(data){ data.originalEvent.preventDefault() };
    stage.mouseover = function(data){ data.originalEvent.preventDefault() };
    stage.mouseout = function(data){ data.originalEvent.preventDefault() };
  }
};


