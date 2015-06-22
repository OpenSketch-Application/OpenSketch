var _Shapes = {
  get_ShapesProperties: function() {
    return {
      _id: _this.curIndex,
      userId: _this._userId,
      layerLevel: _this.layerLevel,
      rotation: _this.rotation,
      objectType: _this.objectType,
      interactive: _this.interactive
    }
  },
  // Use test case to ensure userId, canvasID and Object Type are set
  shapes: function(userId, canvasId, objectType, offset, scrambler) {
    return objectType + userId.substr(0,3) + canvasId.substr(3,3) + scrambler;
  },
  addNew: function(shapeObject, canvasId, scrambler) {
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
  },
  _maxSize: null
}
Object.defineProperty(_Shapes, 'maxSize', {
  get: function() {
    return this._maxSize;
  },
  set: function(maxSize) {
    this._maxSize = maxSize;
  }
})

module.exports = {
  Canvas: {
    stage: null,
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    }
  },
  Tools: {
    selected: '', // Currently selected tool
    // Every new tool will have these defaults settings
    // Can be changed by user for her preferences
    tools: {
      importer: {
        maxSize: 5
      },
      pencil: {
        fillColor: 0x000000,
        strokeWidth: 1
      },
      select: {
        selectedObject: null
      },
      line: {
        fillColor: 0x000000,
        strokeWidth: 1
      },
      rectangle: {
        fillColor: 0x000000,
        strokeColor: 0x000000,
        strokeWidth: 1,
        border:  {
          style: ['solid','dotted','dashed']
        }
      },
      ellipse: {
        fillColor: 0xFFFFFF,
        strokeColor: 0x000000,
        strokeWidth: 1
      },
      templates: {

      },
      table: {
      }
    }
  },
  Shapes: _Shapes,
  Users: {
    currentUser: {
      canDraw: true,
      canChat: true
    },
    users: [] // index 0 is always for Head
  },
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null
};


