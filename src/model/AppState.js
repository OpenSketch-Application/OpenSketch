'user strict';

var AppState = {
  Canvas: {
    stage: null,
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: {
    },
    _shapeTypes: {},
    getBaseProperties: getBaseProperties,
    hasher: shapeHasher,
    addNew: addNew
  },
  Tools: {
    selected: '', // Currently selected tool
    // Every new tool will have these defaults settings
    // Can be changed by user for her preferences
    importer: {
      maxSize: 5
    },
    fill: {
      fillColor: 0xFF0000
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
  },
  Users: {
    currentUser: {},
    users: [] // index 0 is always for Head
  },
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null
};

function getBaseProperties(shapeObject) {
  return {
    _id: shapeObject._id,
    userId: shapeObject.userId,
    layerLevel: shapeObject.layerLevel,
    objectType: shapeObject.objectType,
    rotation: shapeObject.graphics.rotation,
    interactive: shapeObject.graphics.interactive
  }
}

// Use test case to ensure userId, canvasID and Object Type are set
function shapeHasher(userId, canvasId, objectType, offset, scrambler) {
  return objectType + userId.substr(0,3) + canvasId.substr(3,3) + scrambler;
}

// userId: AppState.Users.currentUser._id,
function addNew(objectType, graphics, scrambler) {
  // increment object type number
  var shapeNumRef = this._shapeTypes[objectType];
  var shapeObject = {};
  shapeObject.userId = AppState.Users.currentUser._id || 'unknown';
  shapeObject.objectType = objectType;
  shapeObject.graphics = graphics;

  if(!isNaN(shapeNumRef)) {
    shapeNumRef++;
  }
  else {
    shapeNumRef = 0;
  }

  // shapeNumRef
  scrambler = scrambler || "";

  // Create Unique key
  shapeObject._id = objectType +
                    shapeNumRef +
                    shapeObject.userId.substr(0,3) +
                    scrambler;

  if(shapeObject._id in this.Shapes) {
    scrambler = Math.random() * 100;
    shapeObject._id += scrambler;
  }

  // Set object in Shape Map
  this.Shapes[shapeObject._id] = shapeObject;

  this._shapeTypes[objectType] = shapeNumRef;

  return shapeObject;
}

module.exports = AppState;


