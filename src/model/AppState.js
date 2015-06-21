'use strict';
var _Tools = {
  importer: {},
  select: {},
  pencil: {},
  line: {},
  rectangle: {},
  text: {}
};

Object.defineProperties(_Tools, {
  _toolSelected: {
    value: null
  },
  get: function() {
    return this._toolSelected;
  },
  set: function(selectedTool) {
    this._toolSelected = selectedTool;
  }
})

Object.defineProperty(_Tools.importer, 'maxSize', {
  get: function() {
    return this._maxSize;
  },
  set: function(maxSize) {
    this._maxSize = maxSize;
  }
})

Object.defineProperties(_Tools.select, {
  _selectedObject: {
    value: null
  },
  selectedObject: {
    get: function() {
    return this._selectedObject;
    },
    set: function(selectedObject) {
      this._selectedObject = selectedObject;
    }
  }
});

Object.defineProperties(_Tools.text, {
  _fontSize: {
    value: 12,
    writable: true
  },
  fontSize: {
    get: function() {
    return this._fontSize;
    },
    set: function(fontSize) {
      this._fontSize = fontSize;
    }
  },
  _fontColor: {
    value: 0x000000,
    writable: true
  },
  fontColor: {
    get: function() {
    return this._fontColor;
    },
    set: function(fontColor) {
      this._fontColor = fontColor;
    }
  },
  _fontStyle: {
    value: 'normal',
    writable: true
  },
  fontStyle: {
    get: function() {
    return this._fontStyle;
    },
    set: function(fontStyle) {
      this._fontStyle = fontStyle;
    }
  }
});

Object.defineProperties(_Tools.line, {
  _strokeWidth: {
    value: 1,
    writable: true
  },
  strokeWidth: {
    get: function() {
    return this._strokeWidth;
    },
    set: function(strokeWidth) {
      this._strokeWidth = strokeWidth;
    }
  },
  _strokeColor: {
    value: 0x000000,
    writable: true
  },
  strokeColor: {
    get: function() {
      return this._strokeColor;
    },
    set: function(strokeColor) {
      this._strokeColor = strokeColor;
    }
  },
  _interactive: {
    value: true,
    writable: true
  },
  interactive: {
    get: function() {
      return this._interactive;
    },
    set: function(interactive) {
      this._interactive = interactive;
    }
  }
});

Object.defineProperties(_Tools.pencil, {
  _strokeWidth: {
    value: 1,
    writable: true
  },
  strokeWidth: {
    get: function() {
    return this._strokeWidth;
    },
    set: function(strokeWidth) {
      this._strokeWidth = strokeWidth;
    }
  },
  _fillColor: {
    value: 0x000000
  },
  fillColor: {
    get: function() {
      return this._fillColor;
    },
    set: function(fillColor) {
      this._fillColor = fillColor;
    }
  },
  _interactive: {
    value: true,
    writable: true
  },
  interactive: {
    get: function() {
      return this._interactive;
    },
    set: function(interactive) {
      this._interactive = interactive;
    }
  }
});

Object.defineProperties(_Tools.rectangle, {
  _strokeWidth: {
    value: 1,
    writable: true
  },
  strokeWidth: {
    get: function() {
    return this._strokeWidth;
    },
    set: function(strokeWidth) {
      this._strokeWidth = strokeWidth;
    }
  },
  _strokeColor: {
    value: 0x000000,
    writable: true
  },
  strokeColor: {
    get: function() {
      return this._strokeColor;
    },
    set: function(strokeColor) {
      this._strokeColor = strokeColor;
    }
  },
  _fillColor: {
    value: 0x000000,
    writable: true

  },
  fillColor: {
    get: function() {
      return this._fillColor;
    },
    set: function(fillColor) {
      this._fillColor = fillColor;
    }
  },
  _border: {
    value: {},
    writable: true
  },
  border: {
    get: function() {
      return this._border;
    },
    set: function(border) {
      this._border = border;
    }
  },

});


//   ellipse: {
//     fillColor: 0xFFFFFF,
//     strokeColor: 0x000000,
//     strokeWidth: 1
//   },
//   templates: {

//   },
//   table: {
//   }

var _Shapes = {};

_Shapes.prototype = {
  get_ShapesProperties: function() {
    return {
      _id: _this.curIndex,
      userId: _this._userId,
      layerLevel: _this.layerLevel,
      rotation: _this.rotation,
      objectType: _this.objectType,
      interactive: _this.interactive
    }
  }
}

Object.defineProperties(_Shapes, {
  __id: {
    value: ''
  },
  _id: {
    get: function() {
      return this.__id;
    },
    set: function(id) {
      this.__id = id;
    }
  },
  _interactive: {
    value: true
  },
  interactive: {
    get: function() {
      return this._interactive;
    },
    set: function(interactive) {
      this._interactive = interactive;
    }
  }
})

var _Shapes = {};

// Use test case to ensure userId, canvasID and Object Type are set
function shapes(userId, canvasId, objectType, offset, scrambler) {
  return objectType + userId.substr(0,3) + canvasId.substr(3,3) + scrambler;
}

Object.defineProperties(_Shapes, {
  __hash: {
    value: 0
  },
  _rect: {
    value: 0
  },
  _ellipse: {
    value: 0
  },
  _line: {
    value: 0
  },
  _pencil: {
    value: 0
  },
  addNew: {
    value: function(shapeObject, canvasId, scrambler) {
      // increment object type number
      this[shapeObject.objectType]++;

      // Create Unique key
      shapeObject._id = this[shapeObject.objectType] +
                        shapeObject.userId.substr(0,3) +
                        shapeObject.canvasId.substr(3,3) +
                        scrambler;

      if(shapeObject._id in this) {
        console.log('shapeId exists already!');
      }
      // Set object in Shape Map
      this[shapeObject._id] = shapeObject;

      return shapeObject;
    }
  }
})


// Map.prototype.hash = function(value) {
//   return (typeof value) + ' ' + (value instanceof Object ?
//       (value.__hash || (value.__hash = ++arguments.callee.current)) :
//       value.toString());
// };

//7qNGaETksCmX5TbAAAAQ
// Ellipse
// Rectangle
// Line
var _Users = {
  Current: {

  },
  users: [] // index 0 is always for Head
};



var AppState = {
  Canvas: null,
  Shapes: _Shapes,
  Tools: _Tools,
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null
};

module.exports = AppState;


