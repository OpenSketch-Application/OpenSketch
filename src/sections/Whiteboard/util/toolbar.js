var PIXI = require('pixi');
var find = require('dom-select');
var createPencil = require('./tools/pencil');
var createEraser = require('./tools/eraser');
var createFill = require('./tools/fill');
var createShapes = require('./tools/shapes');
var createText = require('./tools/text');
var createTable = require('./tools/table');
var createImport = require('./tools/import');
var createColor = require('./tools/color');
var createTemplates = require('./tools/templates');

module.exports = toolbar;

function toolbar(elements) {
  var el;
  var imgs = [];
  this.tools = {};
  this.container = find(elements.whiteboard);
  PIXI.dontSayHello = true;

  this.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75, 
                                          document.body.offsetHeight - 60, 
                                          { antialias: true });


  this.container.appendChild(this.renderer.view);
  this.stage = new PIXI.Stage(0xFFFFFF, true);
  this.renderer.render(this.stage);
  
  var settings = {
    container: this.container,
    renderer: this.renderer,
    stage: this.stage
  };

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' ? 
                     elements.tools[tool] : elements.tools[tool].el);
    imgs.push(el);

    el.addEventListener('click', function(e) {
      this.className = 'tool-selected';

      imgs.forEach(function(img) {
        if(img !== this)
          img.className = "";
      }.bind(this));
    });

    switch(tool) {
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
      case 'shapes':
        this.shapes = el;
        createShapes(settings, el);
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
}