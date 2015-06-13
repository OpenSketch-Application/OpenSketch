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
  this.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75, document.body.offsetHeight - 60, {antialias: true});
  this.container.appendChild(this.renderer.view);
  this.stage = new PIXI.Stage(0xFFFFFF, true);
  this.renderer.render(this.stage);
  
  var settings = {
    container: this.container,
    renderer: this.renderer,
    stage: this.stage
  };

  for(var tool in elements.tools) {
    el = find(typeof elements.tools[tool] === 'string' 
              ? elements.tools[tool] : elements.tools[tool].el);

    imgs.push(el);

    switch(tool) {
      case 'pencil':
        this.tools.pencil = el;
        createPencil(settings, this.tools.pencil);
        break;
      case 'eraser':
        //this.tools.eraser = find(elements.tools[tool]);
        //createPencil(settings, this.tools.pencil);
        break;
      case 'fill':
        this.tools.fill = el;
        createFill(settings, this.tools.fill);
        break;
      case 'shapes':
        this.tools.shapes = el;
        createShapes(settings, this.tools.shapes);
        break;
      case 'text':
        this.tools.text = el;
        createText(settings, this.tools.text);
        break;
      case 'table':
        this.tools.table = el;
        createTable(settings, this.tools.table);
        break;
      case 'import':
        this.tools.import = el;
        createImport(settings, this.tools.import);
        break;
      case 'color':
        this.tools.color = el;
        createColor(settings, this.tools.color);
        break;
      case 'templates':
        this.tools.templates = el;
        createTemplates(settings, this.tools.templates);
        break;
      default:
        break;
    }
  }

  imgs.forEach(function(img) {
    img.addEventListener('click', function(e) {

      this.className = 'tool-selected';

      imgs.forEach(function(img) {
        if(img !== this)
          img.className = "";
      }.bind(this));
    });
  });
}