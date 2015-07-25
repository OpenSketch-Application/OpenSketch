'use strict';
var PIXI = require('pixi');
var BaseShape = require('./BaseShape');
var Rectangle = require('./Rectangle');
var keyboardManager = require('../keyboardManager');
var PixiTextInput = require('./PixiTextInput');

//keyboardManager.init();

module.exports = Text;

function Text(shapeProperties) {

  this.pixiText = new PIXI.Text(shapeProperties.textContent, shapeProperties);
  //this.backgroundGraphics = new PIXI.Graphics();
  this.caret = new PIXI.Graphics();

  Rectangle.call(this, shapeProperties);

  console.log(shapeProperties);

  //this._text = 'this is a\n textbox';
  //this.textArray = [];
  this.isFocusClick = false;
  this.lineHeight = (Number.parseInt(this.pixiText.style.font.match('[0-9]+'))
                  + this.pixiText.style.strokeThickness);

  this.totalNewLines = this.getTotalNewLine(shapeProperties.textContent);

  this._caretIndex = 0;
  this._caretYIndex = 0;
  this.prevNewLineIndex = 0;
  if(shapeProperties.wordWrap) {
    //console.log('internal text', this.pixiText.text);
    //console.log(PIXI.Text.prototype.wordWrap.call(this.pixiText, this.pixiText.text));

    //console.log(this.pixiTextWrap('jshdfashjkdfjklsdff', 100));
    // this.pixiText.setText(PIXI.Text.prototype.wordWrap.call(this.pixiText.text));
   //new PixiTextInput('sfjksdjflskjflsd', shapeProperties);
  }

  // We want text to be on top of the two other child graphics objects
  this.graphics.addChild(this.pixiText);
  this.graphics.addChild(this.caret);
  //this.graphics.addChild(this.backgroundGraphics, 4);

  //this.pixiTextSprite = new PIXI.Text('text', shapeProperties);

  this.shapeType = 'textbox';
  this.setProperties(shapeProperties);

  // Attach Event Listeners
  this.onKeyEventBinded = this.onKeyEvent.bind(this);
  this.onDocumentMouseDownBinded = this.onDocumentMouseDown.bind(this);
  window.TEXTFIELD = this;
  //this.onWindowDeselectBinded
}

Text.prototype = Object.create(Rectangle.prototype);
Text.prototype.constructor = Text;

Text.prototype.getTotalNewLine = function(text) {
  var newLines = text.match(/\r|\n/gi);

  return newLines && newLines.length;

}
Text.prototype.showCaret = function() {
  this.caret.clear();
  this.caret.beginFill(0x000000);
  this.caret.drawRect(this.x, this.y, 1, this.lineHeight);
  this.caret.endFill();
}

Text.prototype.calculateCaretPosition = function(keyDirection) {
  // if(this._caretIndex < this.scrollIndex) {
  //   this.caret.position.x = this.x;
  //   return;
  // }

  var textField = this.pixiText.text;
  var currentIndex = this._caretIndex - 1;

  this.totalNewLines = this.getTotalNewLine(this.text);

  this.startIndex = this.text.lastIndexOf('\n', currentIndex);
  if(this.startIndex === -1) this.startIndex = 0;

  var sub;

  if(keyDirection === 'LEFT') {
    //currentIndex = currentIndex + 1;
    if(isNewLine(this.text.charAt(currentIndex))) {
      console.log('got newLine', this.text.charAt(currentIndex), 'index', currentIndex);

      // Decrement y-index of caret
      this._caretYIndex--;

      if(this._caretYIndex < 0) this._caretYIndex = 0;
      //this.startIndex--;
    }

    console.log('prevNewLine', this.text.lastIndexOf('\n', currentIndex), 'nextNewLine', this.text.indexOf('\n', currentIndex));

  }
  else if(keyDirection === 'RIGHT') {
    //currentIndex = currentIndex - 1;
    if(isNewLine(this.text.charAt(currentIndex))) {
      console.log('got newLine, moving right', this.text.charAt(currentIndex), 'index', this._caretIndex);

      // Increment Caret y position
      if(this._caretYIndex < this.totalNewLines)
        this._caretYIndex++;
    }
    console.log('prevNewLine', this.text.lastIndexOf('\n', currentIndex), 'nextNewLine', this.text.indexOf('\n', currentIndex));
  }

  if(this._caretYIndex > 0) this.startIndex--;

  console.log('currentIndex', this._caretIndex, ': caretCheckIndex', currentIndex);

  console.log('startIndex', this.startIndex, 'currentndex', currentIndex, 'currentChar', this.text.charAt(this._caretIndex));

  sub = textField.substring(this.startIndex, this._caretIndex);
  sub.replace(/\n|\r/g, '');

  //.substring(this.scrollIndex);
  var coords = this.pixiText.context.measureText(sub);
  //console.log('curIndex', )
  //console.log('sub To Measure', sub, coords);
  console.log('subText:', sub);
  this.caret.position.x = coords.width; //this.pixiText.context.measureText(sub).width;
  this.caret.position.y = (this._caretYIndex * this.lineHeight * 1.85);

  function isNewLine(character) {
    return character === '\n' || character === '\r';
  }
  //console.log(this.caret.position.y);
}

Text.prototype.hideCursor = function() {
  this.caret.clear();
}

Text.prototype.onKeyEvent = function(e) {
  //console.log('key: ', String.fromCharCode(e.charCode));

  if(e.type === 'keypress') {
    this.text =
      this.text.substring(0, this._caretIndex) +
      String.fromCharCode(e.charCode) +
      this.text.substring(this._caretIndex);
    this._caretIndex++;
  }

  if(e.type === "keydown") {
    console.log('keyCode', e.keyCode);
    switch(e.keyCode) {
      case 8: // Backspace
        // Check if this character is a newline
        if(this._caretIndex > 0) {
          this.text = this.text.substring(0, this._caretIndex - 1) +
            this.text.substring(this._caretIndex);
          this._caretIndex--;
          this.calculateCaretPosition();
        }
        e.preventDefault();
        break;
      case 13: // ENTER

        this.totalNewLines++;

        break;
      case 46: // Del
        // Check if this character is a newline
        this.text =
          this.text.substring(0, this._caretIndex) +
          this.text.substring(this._caretIndex + 1);

        this.calculateCaretPosition();
        e.preventDefault();
        break;
      case 39: // RIGHT Arrow
        this._caretIndex++;
        if(this._caretIndex > this.text.length)
          this._caretIndex = this.text.length;

        this.calculateCaretPosition('RIGHT');
        e.preventDefault();
        break;
      case 37: //LEFT Arrow
        this._caretIndex--;
        if(this._caretIndex < 0)
          this._caretIndex = 0;

        this.calculateCaretPosition('LEFT');
        e.preventDefault();
        break;
      default:
        this.calculateCaretPosition();
        break;
    }
  }
}

Text.prototype.onSelect = function(e) {
  document.addEventListener('keypress', this.onKeyEventBinded);
  document.addEventListener('keydown', this.onKeyEventBinded);
  document.addEventListener('mousedown', this.onDocumentMouseDownBinded);
  //window.addEventListener('windowDeselect', this.windowDeselectBinded);
}

Text.prototype.removeListeners = function(e) {
  document.removeEventListener('keypress', this.onKeyEventBinded);
  document.removeEventListener('keydown', this.onKeyEventBinded);

  document.removeEventListener('mousedown', this.onDocumentMouseDownBinded);
  //window.removeEventListener('windowDeselect', this.windowDeselect);
}

Text.prototype.onDocumentMouseDown = function() {
  if(!this.isFocusClick) this.removeListeners();
}

Text.prototype.getNewLineIndex = function(text, startFrom, backwards) {
  var index;

  if(startFrom === undefined) startFrom = 0;

  if(text.indexOf('\r') !== -1) {
    if(backwards) {
      index = text.lastIndexOf('\n', startFrom);
    }
    else {
      index = text.indexOf('\n', startFrom);
    }
  }
  else {
    if(backwards) {
      index = text.lastIndexOf('\r', startFrom);
    }
    else {
      index = text.indexOf('\r', startFrom);
    }
  }

  return index;
 /*
  jlsdkjf\n
  ksjdfksdf\n
  jsfjkdjfkj\n
  hjhkh
  */
}

Text.prototype.textWrap = function(text, wordWrapWidth) {
  // Greedy wrapping algorithm that will wrap words as the line grows longer
  // than its horizontal bounds.
  var result = '';
  var lines = text.split('\n');

  console.log(this.pixiText.context);

  for(var i = 0; i < lines.length; i++) {
    var words = lines[i].split(' ');
    for(var j = 0; j < words.length; j++) {
      var wordWidth = this.pixiText.context.measureText(words[j]).width;
      var wordWidthWithSpace = wordWidth + this.pixiText.context.measureText(' ').width;
      if(j === 0 || wordWidthWithSpace > wordWrapWidth) {
        // Skip printing the newline if it's the first word of the line that is
        // greater than the word wrap width.
        if(j > 0) {
          result += '\n';
        }
        result += words[j];
        wordWrapWidth = this.pixiText.style.wordWrapWidth - wordWidth;
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

  shape.fontSize = this.fontSize;
  shape.fontFamily = this.fontFamily;

  return shape;
};

Text.prototype.setProperties = function(shapeProperties) {
  this.fontSize = shapeProperties.fontSize || 12;
  this.fontFamily = shapeProperties.fontFamily || 'Arial';
  console.log(shapeProperties);
  // if(shapeProperties.wordWrap) {
  //   //this.pixiText.wordWrap = true;
  //   //this.wordWrapWidth = this.pixiText.wordWrapWidth = shapeProperties.wordWrapWidth;
  // }
  this.padding = shapeProperties.padding || 0;

  this.pixiText.font = this.fontSize + 'px '
                 + this.fontFamily;

  Rectangle.prototype.setProperties.call(this, shapeProperties);
}

// Text.prototype.getGraphics = function() {
//   return this.;
// }

Text.prototype.setText = function(text) {
  //this.pixiTextSprite.text = text;
};

Text.prototype.getText = function(text) {
  //return this.pixiTextSprite.text;
};

Text.prototype.draw = function(shapeProperties) {
  this.graphics.clear();
  //this.graphics.interactive = false;
  console.log('Drawing text');
  if(shapeProperties) {
    if(shapeProperties.x) this.x = this.pixiText.x = shapeProperties.x;
    if(shapeProperties.y) this.y = this.pixiText.y = shapeProperties.y;

    if(shapeProperties.width) {
      this.width = shapeProperties.width;// <= this.wordWrapWidth ? this.wordWrapWidth : shapeProperties.width;
      //this.pixiText.wordWrapWidth = this.width;
    }
    if(shapeProperties.height) {
      this.height = shapeProperties.height;// <= this.pixiText.height ? this.pixiText.height : shapeProperties.height;
      //this.pixiText.fontSize = this.height;
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


  // console.log(this.graphics);
  // debugger;
  //this.graphics.stage.addChild(this.pixiText);

  var scale = {
    x: 1,
    y: 1
  };
  //text = shapes.addNew(text);
  // scale.x = (shapeProperties.x - this.graphics.x)/this.graphics.x + 1;
  // scale.y = (shapeProperties.y - this.graphics.y)/this.graphics.y + 1;

  //this.graphics.scale = scale;

  // Since we cleared all the draw properties for redrawing, we need to set the styles again


  this.graphics.beginFill(this.fillColor);

  // this.pixiText.x = this.x;
  // this.pixiText.y = this.y;
  //this.pixiText.height = this.height * 0.85;
  //this.pixiText.width = this.width * 0.85;
  //this.pixiText.height = this.height;
  //this.pixiText.wordWrapWidth = this.width;

  // Redraw the shape
  this.graphics.drawRect(
    this.graphics.getLocalBounds()
  );

  this.graphics.endFill();

  return this;
};

// Text.prototype.windowDeselect = function() {
//   this.removeListeners();
// }

Text.prototype.setListeners = function(AppState) {
  console.log('Text internal graphics', this.graphics);
  var Tools = AppState.Tools;

  Rectangle.prototype.setMoveListeners.call(this, AppState);

  var baseMouseDown = this.graphics.mousedown;//.bind(this, AppState);
  var baseMouseUp = this.graphics.mouseup;//.bind(this, AppState);
  //keyboardManager.textInput(this.pixiText.setText.bind(this.pixiText));
  //var Select = Tools.select;

  this.graphics.mousedown = function(e) {
    console.log('text mouse down fired', keyboardManager);
    baseMouseDown.call(this, e);

    if(Tools.selected === 'select') {

      // Activate Keyboard listeners
      this.onSelect(e);

      this.isFocusClick = true;

      var _this = this;

      this.showCaret();

      //this.pixiText.context.canvas.focus();

      setTimeout(function() {
        _this.isFocusClick = false;
      }, 0);
      //keyboardManager.textInput(this.pixiText.setText.bind(this.pixiText));

      //this.pixiText.setText('hello');
    }
  }.bind(this);

  // this.gaphics.mouseup = function(e) {
  //   //this.isFocusClick = true;
  // }
  this.graphics.interactive = true;
  // this.graphics.mouseover = function(e) {
  //   this.highlight();
  // }.bind(this);
  // this.graphics.mouseout = function(e) {
  //   this.unHighlight();
  // }.bind(this);
  //this.setRectMoveListeners(AppState);
};

Object.defineProperty(Text.prototype, 'text', {
  get: function() {
    return this.pixiText.text;
  },

  set: function(v) {
    //this._text = v.toString();
    this.pixiText.setText(v.toString());
  }
})

Object.defineProperty(Text.prototype, 'height', {
  get: function() {
    return this.pixiText.height;
  },
  set: function(v) {
    this.pixiText.height = v;//this.graphics.height = v;
    this.draw();
  }
})

Object.defineProperty(Text.prototype, 'width', {
  get: function() {
    return this.pixiText.width;
  },
  set: function(v) {
    this.pixiText.width = v;//this.graphics.width = v;
    this.draw();
  }
})
