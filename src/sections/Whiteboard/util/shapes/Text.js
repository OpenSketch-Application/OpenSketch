'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');
var keyboardManager = require('../keyboardManager');
var PixiTextInput = require('./PixiTextInput');

//keyboardManager.init();

module.exports = Text;

function Text(shapeProperties) {

  BaseShape.call(this, shapeProperties);

  //this.text = new PIXI.Text('sfjksdjflskjflsfhjhfjakshdjasdhkasd', shapeProperties);
  this.textField = new PixiTextInput(shapeProperties.textContent, shapeProperties);

  // We want text to be on top of the two other child graphics objects
  this.graphics.addChildAt(this.textField, 2);

  //this.textSprite = new PIXI.Text('text', shapeProperties);

  this.shapeType = 'textbox';
  this.setProperties(shapeProperties);
}

Text.prototype = Object.create(Rectangle.prototype);
Text.prototype.constructor = Text;

Text.prototype.getProperties = function() {
  //var shape = {};

  var shape = Rectangle.prototype.getProperties.call(this);
  shape.font = this.font;
  shape.textContent = this.textField.text;

  return shape;
};

Text.prototype.setProperties = function(shapeProperties) {
  this.font = shapeProperties.font || '12px Arial';
  this.textField.setText(shapeProperties.textContent);
  this.textField.width = shapeProperties.width || 150;
  //this.wordWrapWidth = this.text.wordWrapWidth = shapeProperties.wordWrapWidth || 100;
  //this.padding = shapeProperties.padding || 0;

  // this.text.font = this.fontSize + 'px '
  //                + this.fontFamily;

  Rectangle.prototype.setProperties.call(this, shapeProperties);
}

// Text.prototype.getGraphics = function() {
//   return this.;
// }

// Text.prototype.setText = function(text) {
//   //this.textSprite.text = text;
// };

// Text.prototype.getText = function(text) {
//   //return this.textSprite.text;
// };

Text.prototype.draw = function(shapeProperties) {
  //this.graphics.clear();
  //this.graphics.interactive = false;
  console.log('Drawing text');

  if(shapeProperties.x) {
    this.textField.x = shapeProperties.x;
    this.x = shapeProperties.x;// - 10;
  }
  if(shapeProperties.y) {
    this.textField.y = shapeProperties.y;
    this.y = shapeProperties.y;// - 10;
  }

    //text.text.x = originalCoords.x;
    //text.text.y = originalCoords.y;
  if(shapeProperties.width) {
    this.width = shapeProperties.width;// + 10*2;// <= this.wordWrapWidth ? this.wordWrapWidth : shapeProperties.width;
    //this.text.wordWrapWidth = this.width;
  }
  if(shapeProperties.height) {
    this.height = shapeProperties.height;// + 10*2;// <= this.text.height ? this.text.height : shapeProperties.height;
    //this.text.fontSize = this.height;
  }
  console.log(shapeProperties);
  console.log(this.getProperties());

  // // console.log(this.graphics);
  // // debugger;
  // //this.graphics.stage.addChild(this.text);

  // var scale = {
  //   x: 1,
  //   y: 1
  // };
  // //text = shapes.addNew(text);
  // // scale.x = (shapeProperties.x - this.graphics.x)/this.graphics.x + 1;
  // // scale.y = (shapeProperties.y - this.graphics.y)/this.graphics.y + 1;

  // //this.graphics.scale = scale;

  // // Since we cleared all the draw properties for redrawing, we need to set the styles again
  // this.graphics.lineWidth = shapeProperties.lineWidth ? this.lineWidth = shapeProperties.lineWidth
  //                                                     : this.lineWidth;

  // this.graphics.lineColor = shapeProperties.lineColor ? this.lineColor = shapeProperties.lineColor
  //                                                     : this.lineColor;
  // this.graphics.lineAlpha = shapeProperties.lineAlpha ? this.lineAlpha = shapeProperties.lineAlpha
  //                                                     : this.lineAlpha;

  // this.graphics.fillAlpha = shapeProperties.fillAlpha ? this.fillAlpha = shapeProperties.fillAlpha
  //                                                     : this.fillAlpha;
  // this.graphics.fillColor = shapeProperties.fillColor ? this.fillColor = shapeProperties.fillColor
  //                                                     : this.fillColor;

  //this.graphics.beginFill(this.fillColor);

  // // this.text.x = this.x;
  // // this.text.y = this.y;
  // //this.text.height = this.height * 0.85;
  // //this.text.width = this.width * 0.85;
  // //this.text.height = this.height;
  // //this.text.wordWrapWidth = this.width;

  // Redraw the shape
  this.graphics.drawRect(
    this.x,
    this.y,
    this.width,
    this.height
  );

  //this.graphics.endFill();

  return this;
};

Text.prototype.getGraphics = function() {
  return this.graphics;
};

Text.prototype.setListeners = function(AppState) {
  Rectangle.prototype.setMoveListeners.call(this, AppState);

  console.log('Text internal graphics', this.graphics);
  var Tools = AppState.Tools;

  //keyboardManager.textInput(this.text.setText.bind(this.text));
  //var Select = Tools.select;

  // this.graphics.mousedown = function(e) {
  //   console.log('text mouse down fired', keyboardManager);
  //   if(Tools.selected === 'select') {
  //     keyboardManager.textInput(this.text.setText.bind(this.text));

  //     //this.text.setText('hello');
  //   }
  // }.bind(this);
  //this.graphics.interactive = true;
  this.graphics.mouseover = function(e) {
    this.highlight();
  }.bind(this);
  this.graphics.mouseout = function(e) {
    this.unHighlight();
  }.bind(this);
  //this.setRectMoveListeners(AppState);
};













