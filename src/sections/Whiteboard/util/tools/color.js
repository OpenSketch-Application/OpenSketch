var PIXI = require('pixi');
var find = require('dom-select');
var $ = require('jquery');
module.exports = function(AppState, el) {
  el.addEventListener('click', function(data) {
    console.log('Selected Color...');

    AppState.Tools.selected = 'color';

    selectPressed = true;
    activate(AppState.Canvas.stage,AppState.Canvas.renderer,AppState);
  });
};
function ColorPicker(AppState){
  var _this  = {}
  _this.UI = $('#color-picker');
  _this.cvs = $('#color-picker canvas');
  _this.ctx = find('#color-picker canvas').getContext('2d');
  _this.selectingPrimary = true;
  _this.Primary = AppState.Tools.Primary;
  _this.Secondary = AppState.Tools.Secondary;

  this.render = function(){
    _this.UI.show();
    _this.img = new Image();  
    _this.img.src = 'images/color-picker.jpg'; 
    
    $(_this.img).load(function(){
      _this.ctx.width = _this.cvs.width;
      _this.ctx.drawImage(_this.img,0,0,270,175);
    });
    _this.cvs.click(function(e){
      var x = e.offsetX;
      var y = e.offsetY;
      if(_this.selectingPrimary)
       _this.Primary = getColor(x,y);
      else
       _this.Secondary = getColor(x,y);
    });    
     
  }
  this.getColor = function(){
    _this.ctx.getImageData(x,y,1,1);
    var select = 'rgb('+img.data[0]+', ' + img.data[1] + ', ' + img.data[2] +')';
    var r,g,b;
    r = parseInt(img.data[0]);
    g = parseInt(img.data[1]);
    b = parseInt(img.data[2]);
    return rgbToHex(r,g,b);
  }
  this.ok = function(){
    AppState.Tools.Primary = _this.Primary; 
    AppState.Tools.Secondary = _this.Secondary;
    _this.UI.hide();
  }
  
}
     
function intToHex(integer){
  var hex = integer.toString(16);
  return hex.length == 2 ? hex : '0' + hex;
};

function rgbToHex(r,g,b){
 return '0x'+intToHex(r) + intToHex(g) + intToHex(b);
}
function activate(stage, renderer,AppState) {
  var color = 0xCAFE00;
  var path = [];
  // var isActive = true;
  var isDown = false;
  var posOld;
  var stageIndex = 0;
  var lines = 0;
  
  colorpicker = new ColorPicker(AppState);
  colorpicker.render();
  

  stage.mousedown = function(data) {
    colorpicker.ok(); 
  };

  stage.mousemove = function(data) {

  };

  stage.mouseup = function() {
    isDown = false;

    if(!path.length) return;
    //graphics.lineStyle(5, color);
    //graphics.moveTo(path[0][0], path[0][1]);
    //graphics.drawPolygon(path);
    while(lines) {
      stage.removeChildAt(stageIndex + lines);
      lines--;
    }

    var graphics = new PIXI.Graphics().lineStyle(2, color);

    graphics.drawPolygon(path);

    graphics.interactive = true;

    graphics.hitArea = graphics.getBounds();

    // moveObject(renderer, stage, graphics, { x: graphics.hitArea.x, y: graphics.hitArea.y });

    stage.addChild(graphics);

    // CanvasObjects.push({
    //   _id: CanvasObjects.length + 1,
    //   type: 'pencil',
    //   coords: path
    // });

    //renderer.render(stage);
  };
}
