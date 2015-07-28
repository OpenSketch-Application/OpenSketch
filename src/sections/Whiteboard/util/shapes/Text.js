'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');

module.exports = Text;

function Text(shapeProperties) {
  this.fontSize = shapeProperties.fontSize || 12;
  this.fontFamily = shapeProperties.fontFamily || 'Arial';
  //this.width = shapeProperties.width || 100;
  //this.height = shapeProperties.height || 100;
  //this.padding = shapeProperties.padding || 0;
  this.textField = new PIXI.Text(shapeProperties.textContent, shapeProperties);

  this.textField.font = this.fontSize + 'px '
                 + this.fontFamily;

  this.caret = new PIXI.Graphics();
  this.text = shapeProperties.textContent;
  // Call Container Shape
  Rectangle.call(this, shapeProperties);

  this.isFocusClick = false;
  this.lineHeight = (Number.parseInt(this.textField.style.font.match('[0-9]+'))
                  + this.textField.style.strokeThickness);

  this._caretXIndex = 0;
  this._caretYIndex = 0;
  this._actualXIndex = 0;

  this.textArray = this.getTextArray(this.text);

  if(shapeProperties.wordWrap) {}

  // We want text to be on top of the two other child graphics objects
  this.graphics.addChild(this.textField);
  this.graphics.addChild(this.caret);

  this.drawBackground();

  //this.graphics.addChild(this.backgroundGraphics);

  //this.textFieldSprite = new PIXI.Text('text', shapeProperties);

  this.shapeType = 'textbox';

  // Attach Event Listeners
  this.onKeyEventBinded = this.onKeyEvent.bind(this);
  this.onDocumentMouseDownBinded = this.onDocumentMouseDown.bind(this);
  //window.TEXTFIELD = this;
  //this.onWindowDeselectBinded
}

Text.prototype = Object.create(Rectangle.prototype);
Text.prototype.constructor = Text;

Text.prototype.getTotalNewLine = function(text) {
  var newLines = text.match(/\r|\n/gi);

  return newLines && newLines.length;
}

Text.prototype.getTextArray = function(text) {
  return text.split(/\n|\r/g);
}

Text.prototype.showCaret = function() {
  this.caret.clear();
  this.caret.beginFill(0x000000);
  this.caret.drawRect(this.x, this.y, 1, this.lineHeight);
  this.caret.endFill();
}

Text.prototype.hideCaret = function() {
  this.caret.clear();
}

Text.prototype.calculateCaretPosition = function() {
  if(this._caretYIndex < 0) {
    this._caretYIndex = 0;
  }
  else if (this._caretYIndex > this.textArray.length - 1) {
    this._caretYIndex = this.textArray.length - 1;
  }

  // Check for RIGHT key
  // Check if caretX if within bounds
  // First check right most bounds
  if(this._caretXIndex > this.textArray[this._caretYIndex].length) {
    // Check if newline exists below it
    if((this._caretYIndex + 1) < this.textArray.length) {
      this._caretXIndex = 0;
      this._caretYIndex++;
    }
    else {
      // Else set it back to last character of line
      this._caretXIndex = this.textArray[this._caretYIndex].length;
    }
  }
  // Checking left most index
  else if(this._caretXIndex < 0) {
    // Check if line exists above
    if(this._caretYIndex - 1 >= 0) {
      this._caretYIndex--;
      this._caretXIndex = this.textArray[this._caretYIndex].length;
    }
    else {
      this._caretYIndex = 0;
    }
  }

  var sub = this.textArray[this._caretYIndex].substring(0, this._caretXIndex);
  var coords = this.textField.context.measureText(sub);

  this.caret.position.x = coords.width;
  this.caret.position.y = (this._caretYIndex * this.lineHeight * 1.55);
}

Text.prototype.getActualXIndex = function() {
  var stringLength = 0;
  for (var i = 0, len = this.textArray.length; i < len; i++) {

    if(this._caretYIndex === i) {
      return stringLength += this._caretXIndex;
    }
    else {
      stringLength += this.textArray[i].length;
    }
  };
  return stringLength;
}

Text.prototype.onKeyEvent = function(e) {

  if(e.type === 'keypress') {
    if(e.keyCode !== 13) {
      var text = this.textArray[this._caretYIndex];
      this.textArray[this._caretYIndex] = text.substring(0, this._caretXIndex) +
      String.fromCharCode(e.charCode) + text.substring(this._caretXIndex);

      this.text = this.textArray.join('\n').toString();

      this._caretXIndex++;

      this.calculateCaretPosition();
    }
  }

  if(e.type === "keydown") {
    console.log('keyCode', e.keyCode);
    switch(e.keyCode) {
      case 8: // Backspace/DEL Mac
        // Basically at the zero index of a line, we check if there is another line
        // above, then concat current line with the line above, mimicking deleting a newline
        if(this._caretXIndex === 0 && this._caretYIndex > 0) {
          this._caretXIndex = this.textArray[this._caretYIndex - 1].length;
          this.textArray[this._caretYIndex - 1] += this.textArray[this._caretYIndex];
          this.textArray.splice(this._caretYIndex, 1);
          this._caretYIndex--;

          this.text = this.textArray.join('\n').toString();
        }
        else {
          var text = this.textArray[this._caretYIndex];
          this.textArray[this._caretYIndex] = text.substring(0, this._caretXIndex - 1) +
                                              text.substring(this._caretXIndex);

          this.text = this.textArray.join('\n').toString();

          this._caretXIndex--;
        }

        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 13: // ENTER
        var nextLine = this.textArray[this._caretYIndex].slice(this._caretXIndex, this.textArray[this._caretYIndex].length);
        this.textArray[this._caretYIndex] = this.textArray[this._caretYIndex].substring(0, this._caretXIndex);
        this.textArray.splice(++this._caretYIndex, 0, nextLine);

        this.text = this.textArray.join('\n').toString();
        this._caretXIndex = 0;
        this.calculateCaretPosition();

        e.preventDefault();
        break;
      case 46: // Del/Windows
        // Check if this character is a newline
        // this.text =
        //   this.text.substring(0, this.getActualXIndex()) +
        //   this.text.substring(this.getActualXIndex() + 1);

        //this.textArray = this.getTextArray(this.text);

        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 37: //LEFT Arrow
        this._caretXIndex--;
        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 38: // UP
        this._caretYIndex--;
        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 39: // RIGHT Arrow
        this._caretXIndex++;
        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 40: //DOWN
        this._caretYIndex++;
        this.calculateCaretPosition();
        e.preventDefault();
        break;
      default:
        this.calculateCaretPosition();
        break;
    }

  }

  this.highlight();
}

Text.prototype.onSelect = function(e) {
  document.addEventListener('keypress', this.onKeyEventBinded);
  document.addEventListener('keydown', this.onKeyEventBinded);
  document.addEventListener('mousedown', this.onDocumentMouseDownBinded);
}

Text.prototype.removeListeners = function(e) {
  document.removeEventListener('keypress', this.onKeyEventBinded);
  document.removeEventListener('keydown', this.onKeyEventBinded);
  document.removeEventListener('mousedown', this.onDocumentMouseDownBinded);

  this.hideCaret();
}

Text.prototype.onDocumentMouseDown = function() {
  if(!this.isFocusClick) this.removeListeners();
}

Text.prototype.drawBackground = function() {
  this.graphics.beginFill(this.fillColor);

  this.graphics.drawRect({
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height
  });

  this.graphics.endFill();
}

Text.prototype.textWrap = function(text, wordWrapWidth) {
  // Greedy wrapping algorithm that will wrap words as the line grows longer
  // than its horizontal bounds.
  var result = '';
  var lines = text.split('\n');

  console.log(this.textField.context);

  for(var i = 0; i < lines.length; i++) {
    var words = lines[i].split(' ');
    for(var j = 0; j < words.length; j++) {
      var wordWidth = this.textField.context.measureText(words[j]).width;
      var wordWidthWithSpace = wordWidth + this.textField.context.measureText(' ').width;
      if(j === 0 || wordWidthWithSpace > wordWrapWidth) {
        // Skip printing the newline if it's the first word of the line that is
        // greater than the word wrap width.
        if(j > 0) {
          result += '\n';
        }
        result += words[j];
        wordWrapWidth = this.textField.style.wordWrapWidth - wordWidth;
      }
      else {
        wordWrapWidth -= wordWidthWithSpace;
        result += ' ' + words[j];
      }
    }

    if(i < lines.length - 1) {
      result += '\n';
    }
  }

  return result;
}

Text.prototype.getProperties = function() {

  var shape = Rectangle.prototype.getProperties.call(this);

  shape.fontColor = this.fontColor;
  shape.font = this.textField.font;
  shape.fontSize = this.fontSize;
  shape.fontFamily = this.fontFamily;
  shape.textContent = this.text;
  shape._caretXIndex = this._caretXIndex;
  shape._caretYIndex = this._caretYIndex;
  shape._actualXIndex = this._actualXIndex;
  shape.stroke = this.textField.stroke;
  shape.align = this.textField.align;
  shape.strokeThickness = this.textField.strokeThickness;

  return shape;
};

Text.prototype.setProperties = function(shapeProperties) {
  Rectangle.prototype.setProperties.call(this);
  if(shapeProperties.font) this.textField.font = shapeProperties.font;
  if(shapeProperties.fontColor) this.fontColor = shapeProperties.fontColor;
  if(shapeProperties.fontSize) this.fontSize = shapeProperties.fontSize;
  if(shapeProperties.fontFamily) this.fontFamily = shapeProperties.fontFamily;
  if(shapeProperties.textContent) this.text = shapeProperties.textContent;
  if(shapeProperties._caretXIndex) this._caretXIndex = shapeProperties._caretXIndex;
  if(shapeProperties._caretYIndex) this._caretYIndex = shapeProperties._caretYIndex;
  if(shapeProperties._actualXIndex) this._actualXIndex = shapeProperties._actualXIndex;
  if(shapeProperties.stroke) this.textField.stroke = shapeProperties.stroke;
  if(shapeProperties.align) this.textField.align = shapeProperties.align;
  if(shapeProperties.strokeThickness) this.textField.strokeThickness;

  //this.textField.setText(shape.textContent);
  this.textArray = this.getTextArray(this.text);

  this.textField.font = this.fontSize + 'px '
                 + this.fontFamily;

  this.lineHeight = (Number.parseInt(this.textField.style.font.match('[0-9]+'))
                  + this.textField.style.strokeThickness);
}

// Text.prototype.getGraphics = function() {
//   return this.;
// }

// Text.prototype.setText = function(text) {
//   //this.textFieldSprite.text = text;
// };

// Text.prototype.getText = function(text) {
//   //return this.textFieldSprite.text;
// };

Text.prototype.draw = function(shapeProperties) {

  //this.graphics.clear();

  //this.graphics.interactive = false;
  console.log('Drawing text');

  if(shapeProperties) {
    //if(shapeProperties.textContent) this.textField.setText(shapeProperties.textContent);
    if(shapeProperties.x) this.x = this.textField.x = shapeProperties.x;
    if(shapeProperties.y) this.y = this.textField.y = shapeProperties.y;
    if(shapeProperties.textContent)  {
      this.textField.setText(shapeProperties.textContent);
      this.textArray = this.getTextArray(this.text);
    }
    // if(shapeProperties.width) {
    //   this.width = shapeProperties.width;// <= this.wordWrapWidth ? this.wordWrapWidth : shapeProperties.width;
    // }
    // if(shapeProperties.height) {
    //   this.height = shapeProperties.height;// <= this.textField.height ? this.textField.height : shapeProperties.height;
    // }
    //Rectangle.setProperties()
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

    this.textField.font = this.fontSize + 'px '
                          + this.fontFamily;

    this.lineHeight = (Number.parseInt(this.textField.style.font.match('[0-9]+'))
                  + this.textField.style.strokeThickness);
  }

  // var scale = {
  //   x: 1,
  //   y: 1
  // };

  // this.graphics.scale = scale;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again
  // this.graphics.beginFill(this.fillColor);
  this.drawBackground();
  // // Redraw the shape
  // this.graphics.drawRect(
  //   this.graphics.getLocalBounds()
  // );

  // this.graphics.endFill();

  return this;
};

// Shape locking/unlocking methods
Text.prototype.lockShape = function(userId) {
  console.log('LOCKing shape');
  this.currentUserId = userId;
  this.highlight(0xFF0000);
  //this.interactive = this.graphics.interactive = false;
  this.locked = true;
  this.removeListeners();
};
Text.prototype.unLockShape = function() {
  console.log('unLOCKing shape');

  this.interactive = this.graphics.interactive = true;
  this.unHighlight();
  this.locked = false;
  this.selected;

};

Text.prototype.setMoveListeners = function(AppState) {
  console.log('Text internal graphics', this.graphics);
  var Tools = AppState.Tools;

  Rectangle.prototype.setMoveListeners.call(this, AppState);

  var baseMouseDown = this.graphics.mousedown;//.bind(this, AppState);
  var baseMouseUp = this.graphics.mouseup;//.bind(this, AppState);
  //keyboardManager.textInput(this.textField.setText.bind(this.textField));
  //var Select = Tools.select;
  this.graphics.mousedown = function(e) {
    baseMouseDown.call(this, e);

    if(Tools.selected === 'select') {

      // Activate Keyboard listeners
      this.onSelect(e);

      this.isFocusClick = true;

      var _this = this;

      this.showCaret();

      //this.textField.context.canvas.focus();

      setTimeout(function() {
        _this.isFocusClick = false;
      }, 0);

      if(!_this.isFocusClick) this.hideCaret();
      //keyboardManager.textInput(this.textField.setText.bind(this.textField));

      //this.textField.setText('hello');
    }
  }.bind(this);

  // this.gaphics.mouseup = function(e) {
  //   this.isFocusClick = true;
  // }

  this.graphics.interactive = true;
};

Object.defineProperty(Text.prototype, 'text', {
  get: function() {
    return this.textField.text;
  },

  set: function(v) {
    //this._text = v.toString();
    this.textField.setText(v.toString());
  }
})

Object.defineProperty(Text.prototype, 'height', {
  get: function() {
    return this.textField.height;
  },
  set: function(v) {
    //this.textField.height = v;//this.graphics.height = v;
    //this.draw();
  }
})

Object.defineProperty(Text.prototype, 'width', {
  get: function() {
    return this.textField.width;
  },
  set: function(v) {
    //this.textField.width = v;//this.graphics.width = v;
    //this.draw();
  }
})
