'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');
var EVENT = require('../../../../model/model').socketEvents;
module.exports = Text;

function Text(shapeProperties) {
  this.fontSize = shapeProperties.fontSize || 12;
  this.fontFamily = shapeProperties.fontFamily || 'Arial';
  this._width;// = shapeProperties.width || 100;
  this._height;// = shapeProperties.height || 100;
  //this.padding = shapeProperties.padding || 0;
  this.textField = new PIXI.Text(shapeProperties.textContent, shapeProperties);

  this.textField.font = this.fontSize + 'px '
                 + this.fontFamily;

  this.caret = new PIXI.Graphics();
  this.backgroundGraphics = new PIXI.Graphics();

  this.text = shapeProperties.textContent;

  this.textField.stroke = shapeProperties.stroke || 0xff1010;
  this.textField.align = shapeProperties.align || 'left';
  this.textField.strokeThickness = shapeProperties.strokeThickness || 1;
  // Call Container Shape
  Rectangle.call(this, shapeProperties);

  this.isFocusClick = false;
  this.fontProperties = this.textField.determineFontProperties(this.textField.font);
  this.caretHeight = this.fontProperties.fontSize * 0.80;
  this.lineHeight = this.fontProperties.fontSize + this.textField.style.strokeThickness;
  //(Number.parseInt(this.textField.style.font.match('[0-9]+'))
  //                + this.textField.style.strokeThickness);

  this._caretXIndex = 0;
  this._caretYIndex = 0;
  this._actualXIndex = 0;

  this.textArray = this.getTextArray(this.text);

  if(shapeProperties.wordWrap) {}

  // We want text to be on top of the two other child graphics objects
  this.graphics.addChild(this.textField);
  this.graphics.addChild(this.caret);
  this.graphics.addChild(this.backgroundGraphics);

  this.width = this.textField.width;
  this.height = this.textField.height;

  this.drawBackground();

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
  this.caret.drawRect(this.x, this.y, 1, this.caretHeight);
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
  this.caret.position.y = (this._caretYIndex * this.lineHeight);
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

  if(this.socket) {
    this.socket.emit(EVENT.shapeEvent, 'modify', this.getProperties());
    this.socket.emit(EVENT.updateObject, this.getProperties());
  }

  this.highlight();

  // Update background width/height
  // if(this.textField.width > this.width) {
  //   this.width = this.textField.width;
  // }
  // else {

  // }
  // if(this.textField.height > this.height) {
  //   this.height = this.textField.height;
  // }
  // this.width = this.textField.width;
  // this.height = this.textField.height;

  //this.drawBackground();
  // Check if width is greater than parent width
}

Text.prototype.onSelect = function(e) {
  document.addEventListener('keypress', this.onKeyEventBinded);
  document.addEventListener('keydown', this.onKeyEventBinded);
  document.addEventListener('mousedown', this.onDocumentMouseDownBinded);
}

Text.prototype.unSelect = function(e) {
  this.removeListeners(e);

  // Restore the original Global Delete Keyboard event
  document.addEventListener('keydown', this.globalKeyDown);
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
  //this.backgroundGraphics.clear();
  console.log('FILLCOLOR', this.fillColor);
  console.log('width', this.width);
  console.log('height', this.height);
  this.graphics.beginFill(0xFF0000);

  this.graphics.drawRect({
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height
  });

  console.log('backgroundGraphics', this.backgroundGraphics);

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
  shape.fillColor = this.fillColor;
  return shape;
};

Text.prototype.setProperties = function(shapeProperties) {
  Rectangle.prototype.setProperties.call(this, shapeProperties);
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
  if(shapeProperties.fillColor) this.fillColor;

  //this.textField.setText(shape.textContent);
  this.textArray = this.getTextArray(this.text);

  this.textField.font = this.fontSize + 'px '
                 + this.fontFamily;

  this.fontProperties = this.textField.determineFontProperties(this.textField.font);
  this.caretHeight = this.fontProperties.fontSize * 0.80;
  this.lineHeight = this.fontProperties.fontSize + this.textField.style.strokeThickness;

  this.calculateCaretPosition();
}

Text.prototype.draw = function(shapeProperties) {
  console.log('Drawing text');

  if(shapeProperties) {
    if(shapeProperties.x) this.x = this.textField.x = shapeProperties.x;
    if(shapeProperties.y) this.y = this.textField.y = shapeProperties.y;

    this.setProperties(shapeProperties);
  }

  this.drawBackground();

  return this;
};

// Shape locking/unlocking methods
Text.prototype.lockShape = function(userId) {
  console.log('LOCKing shape');
  this.currentUserId = userId;
  this.highlight(0xFF0000);
  this.locked = true;
  this.selected = true;
  this.unSelect();
};
Text.prototype.unLockShape = function() {
  console.log('unLOCKing shape');

  this.interactive = this.graphics.interactive = true;
  this.unHighlight();
  this.locked = false;
  this.selected = false;

};

Text.prototype.setMoveListeners = function(AppState) {
  console.log('Text internal graphics', this.graphics);
  var Tools = AppState.Tools;

  Rectangle.prototype.setMoveListeners.call(this, AppState);

  var baseMouseDown = this.graphics.mousedown;
  var baseMouseUp = this.graphics.mouseup;
  this.socket = AppState.Socket;
  var previousClickTime;
  this.globalKeyDown = AppState.GlobalEvents['keydown'];
  var dblClickTimer;

  this.graphics.mousedown = function(e) {
    baseMouseDown.call(this, e);

    if(Tools.selected === 'select') {

      var _this = this;

      if(previousClickTime) {
        // Clear the global delete keyboard event
        document.removeEventListener('keydown', this.globalKeyDown);

        this.isFocusClick = true;

        // Activate Keyboard listeners
        this.onSelect(e);

        this.showCaret();
      }
      else {
        previousClickTime = Date.now();
      }

      dblClickTimer = setTimeout(function() {
        previousClickTime = undefined;
      }, 1200);

      setTimeout(function() {
        _this.isFocusClick = false;
      }, 0);

      if(!this.isFocusClick) {
        this.unSelect();
      }
    }
  }.bind(this);

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
    return this.textField.height;//this._height;
  },
  set: function(v) {
    this._height = v > this.textField.height
                 ? v
                 : this.textField.height;
  }
})

Object.defineProperty(Text.prototype, 'width', {
  get: function() {
    return this.textField.width;//this._width;//this.textField.width;
  },
  set: function(v) {
    //this.backgroundGraphics.width = v;
    this._width = v > this.textField.width
                    ? v
                    : this.textField.width;
    //this.width = v;//this.graphics.width = v;
  }
})
