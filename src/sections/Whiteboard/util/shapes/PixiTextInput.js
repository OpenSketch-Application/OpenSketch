
/**
 * Text input field for pixi.js.
 * A simple example:
 *
 *     // We need a container
 *     var container = new PIXI.DisplayObjectContainer();
 *
 *     // Same style options as PIXI.Text
 *     var style={ ... };
 *
 *     var inputField = new PixiTextInput("hello",style);
 *     container.addChild(inputField);
 *
 * The style definitions accepted by the constructor are the same as those accepted by
 * [PIXI.Text](http://www.goodboydigital.com/pixijs/docs/classes/Text.html).
 * @class PixiTextInput
 * @constructor
 * @param {String} [text] The initial text.
 * @param {Object} [style] Style definition, same as for PIXI.Text
 */
var PIXI = require('pixi');

function PixiTextInput(text, style) {
	PIXI.DisplayObjectContainer.call(this);

	if (!text)
		text = "";

	text = text.toString();

	// if (style && style.wordWrap)
	// 	throw "wordWrap is not supported for input fields";

	this._text = text;

	this.localWidth = 100;
	this._backgroundColor = 0xffffff;
	this._caretColor = 0x000000;
	this._background = true;

	this.scrollIndex = 0;
	this._caretIndex = 0;
	this._caretYIndex = 0;

	this.style = style;
	this.textField = new PIXI.Text(this._text, style);

	this.localHeight = this.textField.height;

	//var lineHeight = fontProperties.fontSize + this.style.strokeThickness;
	var fontProperties = this.textField.determineFontProperties(this.textField.style.font);
	console.log(fontProperties);
	this._lineHeight = (fontProperties.fontSize
										+ this.textField.style.strokeThickness);
	//this.lineHeight += this.lineHeight
	this.lineSpacing = 0;
	this._lines = this._text.split(/(?:\r\n|\r|\n)/).length;
	console.log(this._lineHeight);
	//debugger;
	// this.localHeight =
	// 	this.textField.determineFontHeight('font: ' + this.textField.style.font + ';') +
	// 	this.textField.style.strokeThickness;

	var txt = [
		'firstLine\n', // Remember to subtract index by 1, to not count the newLine char
		'secondLine\n', // Check by looking at charAt(index-1) for mouse click;
										// And charAt(index)
		'\n',
		''
	];




	this.backgroundGraphics = new PIXI.Graphics();
	this.textFieldMask = new PIXI.Graphics();
	this.caret = new PIXI.Graphics();
	this.drawElements();

	this.addChild(this.backgroundGraphics);
	this.addChild(this.textField);
	this.addChild(this.caret);
	this.addChild(this.textFieldMask);


	this.caretFlashInterval = null;
	this.blur();
	this.updateCaretPosition();

	this.backgroundGraphics.interactive = true;
	this.backgroundGraphics.buttonMode = true;
	this.backgroundGraphics.defaultCursor = "text";

	this.backgroundGraphics.mousedown = this.onBackgroundMouseDown.bind(this);
	this.keyEventClosure = this.onKeyEvent.bind(this);
	this.windowBlurClosure = this.onWindowBlur.bind(this);
	this.documentMouseDownClosure = this.onDocumentMouseDown.bind(this);
	this.isFocusClick = false;

	this.updateText();

	this.textField.mask = this.textFieldMask;

	this.keypress = null;
	this.keydown = null;
	this.change = null;
}

PixiTextInput.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PixiTextInput.prototype.constructor = PixiTextInput;


PixiTextInput.prototype.getLineHeight = function() {
	var fontProperties = this.textField.determineFontProperties(this.textField.style.font);
	//console.log(this.textField.fontPropertiesCache);
	console.log(fontProperties);
	return fontProperties.ascent - fontProperties.descent;
}
/**
 * Someone clicked.
 * @method onBackgroundMouseDown
 * @private
 */
PixiTextInput.prototype.onBackgroundMouseDown = function(e) {
	var coords = e.getLocalPosition(this);
	var caretIndices = this.getCaretIndexByCoord(coords);
	this._caretIndex = caretIndices.xIndex;
	this._caretYIndex = caretIndices.yIndex;

	this.updateCaretPosition();
	console.log(caretIndices);

	this.focus();

	this.isFocusClick = true;
	var scope = this;
	setTimeout(function() {
		scope.isFocusClick = false;
	}, 0);
}

/**
 * Map position to caret index.
 * @method getCaretIndexByCoord
 * @private
 */
PixiTextInput.prototype.getCaretIndexByCoord = function(coords) {
	var smallest = 10000;
	var cand = 0;
	var visible = this._text.substring(this.scrollIndex);

	for (i = 0; i < visible.length + 1; i++) {
		var sub = visible.substring(0, i);
		var w = this.textField.context.measureText(sub).width;

		if (Math.abs(w - coords.x) < smallest) {
			smallest = Math.abs(w - coords.x);
			cand = i;
		}
	}

	// Unit to divide textbox height by
	//var lineDiff = this.lineHeight;

	// Determine vertical pixels to map cursor position to
	var yIndex = Math.ceil(coords.y/this._lineHeight) - 1;
	if(yIndex > this._lines - 1)
		yIndex = this._lines - 1;

	console.log(coords);

	// debugger;
	return  {
		xIndex: this.scrollIndex + cand,
		yIndex: yIndex
	}
}


/**
 * Focus this input field.
 * @method focus
 */
PixiTextInput.prototype.focus = function() {
	this.blur();

	document.addEventListener("keydown", this.keyEventClosure);
	document.addEventListener("keypress", this.keyEventClosure);
	document.addEventListener("mousedown", this.documentMouseDownClosure);
	window.addEventListener("blur", this.windowBlurClosure);

	this.showCaret();
}

/**
 * Handle key event.
 * @method onKeyEvent
 * @private
 */
PixiTextInput.prototype.onKeyEvent = function(e) {
	/*console.log("key event");
	console.log(e);*/

	if (e.type == "keypress") {
		if (e.charCode < 32)
			return;

		this._text =
			this._text.substring(0, this._caretIndex) +
			String.fromCharCode(e.charCode) +
			this._text.substring(this._caretIndex);

		// Check for overflow, if overflow false (default)
    // wrap text
    // if(this.style.wordWrap && !isNaN(this.style.wordWrapWidth)) {
    //   if(this._text.length > this.style.wordWrapWidth) {
    //     console.log('text width greater than bounds');


    //     // Set caret index back to 0;
    //     // Set caret x position to 1;
    //     // Set caret y position to +1;
    //     //return true;
    //   }
    // }

		this._caretIndex++;
		this.ensureCaretInView();
		this.showCaret();
		this.updateText();
		this.trigger(this.keypress, e);
		this.trigger(this.change);
	}

	if (e.type == "keydown") {
		switch (e.keyCode) {
			case 8: // BackSpace
				if (this._caretIndex > 0) {
					this._text =
						this._text.substring(0, this._caretIndex - 1) +
						this._text.substring(this._caretIndex);

					this._caretIndex--;
					this.ensureCaretInView();
					this.showCaret();
					this.updateText();
				}
				e.preventDefault();
				this.trigger(this.change);
				break;

			case 46: // DEL
				this._text =
					this._text.substring(0, this._caretIndex) +
					this._text.substring(this._caretIndex + 1);

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
				e.preventDefault();
				this.trigger(this.change);
				break;

			case 39: // RIGHT Arrow
				this._caretIndex++;
				if (this._caretIndex > this._text.length)
					this._caretIndex = this._text.length;

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
        e.preventDefault();
        console.log('curIndex', this._caretIndex, 'char:', this._text.charAt(this._caretIndex));

				break;

			case 37: // LEFT Arrow
				this._caretIndex--;
				if (this._caretIndex < 0)
					this._caretIndex = 0;

				this.ensureCaretInView();
				this.updateCaretPosition();
				this.showCaret();
				this.updateText();
        e.preventDefault();
        console.log('curIndex', this._caretIndex, 'char:', this._text.charAt(this._caretIndex));

				break;

			case 38: // UP Arrow

        break;

      case 40: // Down Arrow
      	// Keep current Cursor index

        break;
      case 13: // ENTER
      	this._caretYIndex += 1;
      	this._caretIndex = 0;
      	this._text += '\n';
      	this._lines++;
      	this.updateCaretPosition();
      	break;
		}

		this.trigger(this.keydown, e);
	}
}

/**
 * Ensure the caret is not outside the bounds.
 * @method ensureCaretInView
 * @private
 */
PixiTextInput.prototype.ensureCaretInView = function() {
	this.updateCaretPosition();

	while (this.caret.position.x >= this.localWidth - 1) {
		this.scrollIndex++;
		this.updateCaretPosition();
	}

	while (this.caret.position.x < 0) {
		this.scrollIndex -= 2;
		if (this.scrollIndex < 0)
			this.scrollIndex = 0;
		this.updateCaretPosition();
	}
}

/**
 * Blur ourself.
 * @method blur
 */
PixiTextInput.prototype.blur = function() {
	document.removeEventListener("keydown", this.keyEventClosure);
	document.removeEventListener("keypress", this.keyEventClosure);
	document.removeEventListener("mousedown", this.documentMouseDownClosure);
	window.removeEventListener("blur", this.windowBlurClosure);

	this.hideCaret();
}

/**
 * Window blur.
 * @method onDocumentMouseDown
 * @private
 */
PixiTextInput.prototype.onDocumentMouseDown = function() {
	if (!this.isFocusClick)
		this.blur();
}

/**
 * Window blur.
 * @method onWindowBlur
 * @private
 */
PixiTextInput.prototype.onWindowBlur = function() {
	this.blur();
}

/**
 * Update caret Position.
 * @method updateCaretPosition
 * @private
 */
PixiTextInput.prototype.updateCaretPosition = function() {
	var subDimensions;
	var sub;

	if (this._caretIndex < this.scrollIndex) {
		this.caret.position.x = -1;

		// In case we run into the beginning of the line
		if(this._caretYIndex > 1) {

			//this._caretIndex = 0;

			this._caretYIndex--;
		}
		return;
	}
	else if(this._text.charAt(this._caretIndex) === '\n') {
		this.scrollIndex = this._text.indexOf('\n', this._caretIndex + 1) - this._caretIndex;
		console.log('scrollIndex', this.scrollIndex, 'curIndex', this._caretIndex);
		// If there are no more newlines after the previously encountered new line, get the end of
		// the text string, we also need to remove the new lines when calculating
		if(this.scrollIndex < 0) {
			this.scrollIndex = (this._text.length - this._lines) - (this._caretIndex);
			debugger;
		}

		if(this.style.align === 'center') {
			sub = this._text.substring(this._caretIndex + 1, this.scrollIndex);
			subDimensions = this.textField.context.measureText(sub);
			this._caretIndex = 0;
			this.caret.position.x = subDimensions.width;
			debugger;
		}

		//this._caretIndex = 0;
		this._caretYIndex++;
		this.caret.position.y = (this._caretYIndex * this._lineHeight);

		return;
	}

	sub = this._text.substring(0, this._caretIndex).substring(this.scrollIndex);

	subDimensions = this.textField.context.measureText(sub);
	console.log(subDimensions);
	//debugger;
	this.caret.position.x = subDimensions.width;
	this.caret.position.y = (this._caretYIndex * this._lineHeight);
	//console.log(this.caret.position.y);

	// 	this.textField.style.strokeThickness;
	// 	this.textField.style.font
}

/**
 * Update text.
 * @method updateText
 * @private
 */
PixiTextInput.prototype.updateText = function() {
	//this.textField.setText(this._text);
	this.textField.setText(this._text.substring(this.scrollIndex));
}

/**
 * Draw the background and caret.
 * @method drawElements
 * @private
 */
PixiTextInput.prototype.drawElements = function() {
	this.backgroundGraphics.clear();
	this.backgroundGraphics.beginFill(this._backgroundColor);
	var lines = this._caretYIndex + 1;
	console.log('lines', lines);

	if (this._background)
		this.backgroundGraphics.drawRect(0, 0, this.localWidth, this.localHeight * lines);

	this.backgroundGraphics.endFill();
	this.backgroundGraphics.hitArea = new PIXI.Rectangle(0, 0, this.localWidth, this.localHeight * lines);

	this.textFieldMask.clear();
	this.textFieldMask.beginFill(this._backgroundColor);
	this.textFieldMask.drawRect(0, 0, this.localWidth, this.localHeight * lines);
	this.textFieldMask.endFill();


  //this.canvas.height = height * this.resolution;
 	console.log('RESOLUTION', this.textField.resolution);
 	//linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;
  //this.context.scale( this.resolution, this.resolution);

	this.caret.clear();
	this.caret.beginFill(this._caretColor);
	this.caret.drawRect(1, 1, 1, this._lineHeight);
	this.caret.endFill();
}

/**
 * Show caret.
 * @method showCaret
 * @private
 */
PixiTextInput.prototype.showCaret = function() {
	if (this.caretFlashInterval) {
		clearInterval(this.caretFlashInterval);
		this.caretFlashInterval = null;
	}

	this.caret.visible = true;
	this.caretFlashInterval = setInterval(this.onCaretFlashInterval.bind(this), 500);
}

/**
 * Hide caret.
 * @method hideCaret
 * @private
 */
PixiTextInput.prototype.hideCaret = function() {
	if (this.caretFlashInterval) {
		clearInterval(this.caretFlashInterval);
		this.caretFlashInterval = null;
	}

	this.caret.visible = false;
}

/**
 * Caret flash interval.
 * @method onCaretFlashInterval
 * @private
 */
PixiTextInput.prototype.onCaretFlashInterval = function() {
	this.caret.visible = !this.caret.visible;
}

/**
 * The width of the PixiTextInput. This is overridden to have a slightly
 * different behaivour than the other DisplayObjects. Setting the
 * width of the PixiTextInput does not change the scale, but it rather
 * makes the field larger. If you actually want to scale it,
 * use the scale property.
 * @property width
 * @type Number
 */
Object.defineProperty(PixiTextInput.prototype, "width", {
	get: function() {
		return this.scale.x * this.getLocalBounds().width;
	},

	set: function(v) {
		this.localWidth = v;
		this.drawElements();
		this.ensureCaretInView();
		this.updateText();
	}
});

Object.defineProperty(PixiTextInput.prototype, 'height', {
    get: function() {
    	return this.scale.y * this.getLocalBounds().height;
    },
    set: function(v) {
    	this.localHeight = v;
      this.localWidth = v;
			this.drawElements();
			this.ensureCaretInView();
			this.updateText();
    }
});

/**
 * The text in the input field. Setting will have the implicit function of resetting the scroll
 * of the input field and removing focus.
 * @property text
 * @type String
 */
Object.defineProperty(PixiTextInput.prototype, "text", {
	get: function() {
		return this._text;
	},

	set: function(v) {
		this._text = v.toString();
		this.scrollIndex = 0;
		this.caretIndex = 0;
		this.blur();
		this.updateText();
	}
});

/**
 * The color of the background for the input field.
 * This needs to be specified as an integer, not using HTML
 * notation, e.g. for red background:
 *
 *     myInputText.backgroundColor = 0xff0000;
 *
 * In order for the background to be drawn, the `background`
 * property needs to be true. If not, this property will have
 * no effect.
 * @property backgroundColor
 * @type Integer
 */
Object.defineProperty(PixiTextInput.prototype, "backgroundColor", {
	get: function() {
		return this._backgroundColor;
	},

	set: function(v) {
		this._backgroundColor = v;
		this.drawElements();
	}
});

/**
 * The color of the caret.
 * @property caretColor
 * @type Integer
 */
Object.defineProperty(PixiTextInput.prototype, "caretColor", {
	get: function() {
		return this._caretColor;
	},

	set: function(v) {
		this._caretColor = v;
		this.drawElements();
	}
});

/**
 * Determines if the background should be drawn behind the text.
 * The color of the background is specified using the backgroundColor
 * property.
 * @property background
 * @type Boolean
 */
Object.defineProperty(PixiTextInput.prototype, "background", {
	get: function() {
		return this._background;
	},

	set: function(v) {
		this._background = v;
		this.drawElements();
	}
});

/**
 * Set text.
 * @method setText
 * @param {String} text The new text.
 */
PixiTextInput.prototype.setText = function(v) {
	this.text = v;
}

/**
 * Trigger an event function if it exists.
 * @method trigger
 * @private
 */
PixiTextInput.prototype.trigger = function(fn, e) {
	if (fn)
		fn(e);
}

if (typeof module !== 'undefined') {
	module.exports = PixiTextInput;
}
