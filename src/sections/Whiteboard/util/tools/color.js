var PIXI = require('pixi');
var $ = require('jquery');
var spectrum = require('spectrum-colorpicker')($);

module.exports = function(el, AppState) {
  el.addEventListener('click', function(data) {
    data.preventDefault();

    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    console.log('Selected Color...');

    AppState.Tools.selected = 'color';

    selectPressed = true;

    activate(AppState);

    return false;
  });
};

function activate(AppState) {

 $('#color-wheel').addClass('colorWheelOpen');

 var f = AppState.Tools.Colors.fill; 
 var l = AppState.Tools.Colors.line;

 $('#color-wheel #fill').spectrum({showInput: true, color:'#'+ hextostring(f),change: function(color){
    AppState.Tools.Colors.fill = rgbtohex(color._r,color._g,color._b); 
    updateTools(AppState.Tools);
    console.log('primary changed');
   }});
 $('#color-wheel #line').spectrum({showInput: true, color:'#'+ hextostring(l),change: function(color){
      
   AppState.Tools.Colors.line = rgbtohex(color._r,color._g,color._b); 
   updateTools(AppState.Tools);
   console.log('secondary changed');
   }});



}
function updateTools(Tools){
  var lineC = Tools.Colors.line;
  var fillC = Tools.Colors.fill;
  Tools.pencil.lineColor = lineC;  
  Tools.rectangle.lineColor = lineC;
  Tools.ellipse.lineColor = lineC;
  Tools.line.lineColor = lineC;
  Tools.rectangle.fillColor = fillC;
  Tools.ellipse.fillColor = fillC;
  Tools.table.fillColor = fillC;
  Tools.table.lineColor = lineC;
  Tools.fill.fillColor = fillC; 
  
}
function rgbtohex(r,g,b){
  var ir = parseInt(r).toString(16);
  var ig = parseInt(g).toString(16);
  var ib = parseInt(b).toString(16);
  var val = ir +ig + ib; 
  val = parseInt(val,16);
  return val; 
}
function hextostring(hex){
  var val = hex.toString(16); 
  return val; 
}
