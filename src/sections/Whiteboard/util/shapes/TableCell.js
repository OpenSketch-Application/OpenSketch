'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');
var EVENT = require('../../../../model/model').socketEvents;
module.exports = TableCell;

function TableCell(shapeProperties) {
  this.fontSize = shapeProperties.fontSize || 12;
  this.fontFamily = shapeProperties.fontFamily || 'Arial';
  this._width;// = shapeProperties.width || 100;
  this._height;// = shapeProperties.height || 100;

  this.parentContainer; // When attached to a parent
  this.cellCoords = [];
  this.maxWidth = 0; // Will be set by Parent's draw method
  this.maxHeight = 0; // Set by Parent's draw method

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

TableCell.prototype = Object.create(Rectangle.prototype);
TableCell.prototype.constructor = TableCell;

TableCell.prototype.getTotalNewLine = function(text) {
  var newLines = text.match(/\r|\n/gi);

  return newLines && newLines.length;
}

TableCell.prototype.getTextArray = function(text) {
  return text.split(/\n|\r/g);
}

TableCell.prototype.showCaret = function() {
  this.caret.clear();
  this.caret.beginFill(0x000000);
  this.caret.drawRect(this.x, this.y, 1, this.caretHeight);
  this.caret.endFill();
}

TableCell.prototype.hideCaret = function() {
  this.caret.clear();
}

TableCell.prototype.calculateCaretPosition = function() {
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

TableCell.prototype.getActualXIndex = function() {
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

TableCell.prototype.onKeyEvent = function(e) {

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
  if(this.textField.width > this.width) {
    this.width = this.textField.width;
  }
  else {

  }
  if(this.textField.height > this.height) {
    this.height = this.textField.height;
  }

  this.width = this.textField.width;
  this.height = this.textField.height;
  var xDiff = this.width > this.maxWidth ? this.width - this.maxWidth : 0;
  var yDiff = this.height > this.maxHeight ? this.height - this.maxHeight : 0;

  if(xDiff !== 0 || yDiff !== 0) {

    // Recalculate all the parent's containers children's cells
    this.parentContainer.reDraw({
      xDiff: xDiff,
      yDiff: yDiff
    }, this.cellCoords);
    if(xDiff !== 0) {
      this.maxWidth = this.width;
      this.parentContainer.colWidths[this.cellCoords[1]] = this.width;
    }
    if(yDiff !== 0) {
      this.maxHeight = this.height;
      this.parentContainer.rowHeights[this.cellCoords[0]] = this.height;
    }
  }
  //else {
  this.drawBackground();
  //}
  // Check if width is greater than parent width
  // ie. parent's column width

  // Check if height is greater than parent's row height
  // ie. parent's row height
}

TableCell.prototype.onSelect = function(e) {
  document.addEventListener('keypress', this.onKeyEventBinded);
  document.addEventListener('keydown', this.onKeyEventBinded);
  document.addEventListener('mousedown', this.onDocumentMouseDownBinded);
}

TableCell.prototype.unSelect = function(e) {
  this.removeListeners(e);
  this.unHighlight();
  // Restore the original Global Delete Keyboard event
  document.addEventListener('keydown', this.globalKeyDown);
}

TableCell.prototype.removeListeners = function(e) {
  document.removeEventListener('keypress', this.onKeyEventBinded);
  document.removeEventListener('keydown', this.onKeyEventBinded);
  document.removeEventListener('mousedown', this.onDocumentMouseDownBinded);

  this.hideCaret();
}

TableCell.prototype.onDocumentMouseDown = function() {
  if(!this.isFocusClick) this.removeListeners();
}

TableCell.prototype.drawBackground = function() {
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

TableCell.prototype.textWrap = function(text, wordWrapWidth) {
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

TableCell.prototype.getProperties = function() {

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

TableCell.prototype.setProperties = function(shapeProperties) {
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

TableCell.prototype.draw = function(shapeProperties) {
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
TableCell.prototype.lockShape = function(userId) {
  console.log('LOCKing shape');
  this.currentUserId = userId;
  this.highlight(0xFF0000);
  this.locked = true;
  this.selected = true;
  this.unSelect();
};
TableCell.prototype.unLockShape = function() {
  console.log('unLOCKing shape');

  this.interactive = this.graphics.interactive = true;
  this.unHighlight();
  this.locked = false;
  this.selected = false;

};

TableCell.prototype.setMoveListeners = function(AppState) {
  console.log('Text internal graphics', this.graphics);
  var Tools = AppState.Tools;

  //Rectangle.prototype.setMoveListeners.call(this, AppState);

  //var baseMouseDown = this.graphics.mousedown;
  //var baseMouseUp = this.graphics.mouseup;
  this.socket = AppState.Socket;
  var previousClickTime;
  this.globalKeyDown = AppState.GlobalEvents['keydown'];
  var dblClickTimer;

  this.graphics.mousedown = function(e) {
    //baseMouseDown.call(this, e);
    if(Tools.selected === 'select') {

      var _this = this;

      if(previousClickTime) {
        // Clear the global delete keyboard event
        document.removeEventListener('keydown', this.globalKeyDown);

        this.isFocusClick = true;
        this.parentContainer.selectedCell = this;
        // Activate Keyboard listeners
        this.onSelect(e);

        this.showCaret();
      }
      else {
        previousClickTime = Date.now();
      }

      this.highlight();

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

// Object.defineProperty(TableCell.prototype, 'x', {
//   get: function() {
//     return this.graphics.x;
//   },
//   set: function(v) {
//     this.graphics.position.x = v;
//   }
// });

// Object.defineProperty(TableCell.prototype, 'y', {
//   get: function() {
//     return this.graphics.position.y;
//   },
//   set: function(v) {
//     this.graphics.position.y = v;
//   }
// });

Object.defineProperty(TableCell.prototype, 'text', {
  get: function() {
    return this.textField.text;
  },

  set: function(v) {
    //this._text = v.toString();
    this.textField.setText(v.toString());
  }
})

Object.defineProperty(TableCell.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(v) {
    this._height = v > this.textField.height
                 ? v
                 : this.textField.height;
  }
})

Object.defineProperty(TableCell.prototype, 'width', {
  get: function() {
    return this._width;//this.textField.width;
  },
  set: function(v) {
    //this.backgroundGraphics.width = v;
    this._width = v > this.textField.width
                    ? v
                    : this.textField.width;
    //this.width = v;//this.graphics.width = v;
    //this.draw();
  }
})
