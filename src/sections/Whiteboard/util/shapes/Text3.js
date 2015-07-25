'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');
var keyboardManager = require('../keyboardManager');
var PixiTextInput = require('./PixiTextInput');

module.exports = Text;

function Text(shapeProperties) {

  //this.text = new PIXI.Text('sfjksdjflskjflsfhjhfjakshdjasdhkasd', shapeProperties);
  this.textField = new PixiTextInput(shapeProperties.textContent, shapeProperties);
  this.caret = new PIXI.Graphics();

  Rectangle.call(this, shapeProperties);

  // We want text to be on top of the two other child graphics objects
  //this.graphics.addChildAt(this.textField, 2);

  this._caretIndex = 0;
  this._caretYIndex = 0;

  this.graphics.addChild(this.textField);
  this.graphics.addChild(this.caret);

  this.shapeType = 'textbox';
  this.font = shapeProperties.font || '12px Arial';
  this.textField.setText(shapeProperties.textContent || 'Textbox');
  this.textField.width = shapeProperties.width || 150;
  //this.setProperties(shapeProperties);
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
  if(shapeProperties.font) this.font = shapeProperties.font;
  if(shapeProperties.textContent) this.textField.setText(shapeProperties.textContent);
  if(shapeProperties.width) this.textField.width = shapeProperties.width;// || 150;
  //this.wordWrapWidth = this.text.wordWrapWidth = shapeProperties.wordWrapWidth || 100;
  //this.padding = shapeProperties.padding || 0;

  // this.text.font = this.fontSize + 'px '
  //                + this.fontFamily;

  Rectangle.prototype.setProperties.call(this, shapeProperties);
}

Text.prototype.showCaret = function() {
  this.caret.clear();
  this.caret.beginFill(0x000000);
  this.caret.drawRect(this.x, this.y, 1, this.lineHeight);
  this.caret.endFill();
}

Text.prototype.calculateCaretPosition = function() {
  if(this._caretIndex < this.scrollIndex) {
    this.caret.position.x = this.x;
    return;
  }
  //if(this.textthis._caretIndex)
  //var text = this.text;
  //if(endOfline === -1) endOfLine = this.text.length;
  //skjfl
  //sdf
  //dffgf
  // endOfLines = [5,3,5]
  // maxLines = endOfLines.length
  console.log('char', this.text[this._caretIndex]);
  var startIndex = 0;
  var endIndex = this._caretIndex;
  if(this.text.charAt(this._caretIndex) === '\n') {
    this._caretYIndex++;
    startIndex = 0;
  }

  var sub = this.text.substring(startIndex, endIndex); //.substring(this.scrollIndex);
  var coords = this.textField.context.measureText(sub);

  console.log(sub, coords);

  this.caret.position.x = coords.width; //this.textField.context.measureText(sub).width;
  this.caret.position.y = (this._caretYIndex * this.lineHeight);

  console.log(this.caret.position.y);
}

Text.prototype.draw = function(shapeProperties) {
  //this.graphics.clear();
  //this.graphics.interactive = false;
  console.log('Drawing text');

  // if(shapeProperties.x) {
  //   this.textField.x = shapeProperties.x;
  //   this.x = shapeProperties.x;// - 10;
  // }
  // if(shapeProperties.y) {
  //   this.textField.y = shapeProperties.y;
  //   this.y = shapeProperties.y;// - 10;
  // }

  //   //text.text.x = originalCoords.x;
  //   //text.text.y = originalCoords.y;
  // if(shapeProperties.width) {
  //   this.width = shapeProperties.width;// + 10*2;// <= this.wordWrapWidth ? this.wordWrapWidth : shapeProperties.width;
  //   //this.text.wordWrapWidth = this.width;
  // }
  // if(shapeProperties.height) {
  //   this.height = shapeProperties.height;// + 10*2;// <= this.text.height ? this.text.height : shapeProperties.height;
  //   //this.text.fontSize = this.height;
  // }
  // console.log(shapeProperties);
  // console.log(this.getProperties());

  if(shapeProperties) {
    if(shapeProperties.x) {
      this.textField.x = shapeProperties.x;
      this.x = shapeProperties.x;// - 10;
    }
    if(shapeProperties.y) {
      this.textField.y = shapeProperties.y;
      this.y = shapeProperties.y;// - 10;
    }
    if(shapeProperties.width) {
      this.width = shapeProperties.width;// <= this.wordWrapWidth ? this.wordWrapWidth : shapeProperties.width;
      //this.textField.wordWrapWidth = this.width;
    }
    if(shapeProperties.height) {
      this.height = shapeProperties.height;// <= this.textField.height ? this.textField.height : shapeProperties.height;
      //this.textField.fontSize = this.height;
    }

    this.graphics.lineWidth = shapeProperties.lineWidth ? this.lineWidth = shapeProperties.lineWidth
                                                      : this.lineWidth;

    this.graphics.lineColor = shapeProperties.lineColor ? this.lineColor = shapeProperties.lineColor
                                                        : this.lineColor;
    this.graphics.lineAlpha = shapeProperties.lineAlpha ? this.lineAlpha = shapeProperties.lineAlpha
                                                        : this.lineAlpha;

    this.graphics.fillAlpha = shapeProperties.fillAlpha ? this.fillAlpha = shapeProperties.fillAlpha
                                                          : this.fillAlpha;
    this.graphics.fillColor = shapeProperties.fillColor ? this.fillColor = shapeProperties.fillColor
                                                        : this.fillColor;
  }

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













