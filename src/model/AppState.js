'use strict';
var Tools = {
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
    mouseData: null,
    selectedObject: null
  },
  line: {
    fillColor: 0x000000,
    strokeWidth: 1
  },
  rectangle: {
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0x913ce6,
    fillAlpha: 0.25
  },
  ellipse: {
    fillColor: 0xFFFFFF,
    strokeColor: 0x000000,
    strokeWidth: 1
  },
  templates: {},
  table: {}
};

var Shapes = {
  addNew: addNew,
  removeShape: removeShape,
  _shapeTypes: {},
  hashKeys: ['#', '@', '&', '*', '%']
};

// Use test case to ensure userId, canvasID and Object Type are set
// userId: AppState.Users.currentUser._id,
function addNew(shapeObject, stage) {
  // increment object type number
  var shapeNumRef = this._shapeTypes[shapeObject.objectType];

  shapeObject.userId = shapeObject.userId || 'unknown';
  var keyIndex = 0;

  if(!isNaN(shapeNumRef)) {
    shapeNumRef++;
  }
  else {
    shapeNumRef = 0;
  }

  // Create Unique key
  shapeObject._id = '_' + shapeObject.objectType +
                    shapeNumRef +
                    shapeObject.userId.substr(0,3);

  while(this[shapeObject._id]) {
    shapeNumRef = shapeNumRef%2 === 0 ? shapeNumRef + 1
                                    : shapeNumRef;
    shapeObject._id = shapeObject._id + shapeObject.hashKeys[keyIndex] + shapeNumRef;
    keyIndex = ++keyIndex%5;
  }

  // Set object in Shape Map
  this[shapeObject._id] = shapeObject;

  // Add stage reference to this Shape
  shapeObject.stage = stage;

  // Add stage/layer level the shape will be inserted at
  stage.addChildAt(shapeObject.graphics, shapeNumRef);

  shapeObject.layerLevel = stage.children.length;

  this._shapeTypes[shapeObject.objectType] = shapeNumRef;

  return shapeObject;
}

function removeShape(shapeObject) {}

var AppState = {
  Canvas: {
    stage: null,
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: Shapes,
    //ActiveShapes: {}, // Locks for shapes being handled by multiple users
    addNew: addNew
  },
  Tools: Object.preventExtensions(Tools),
  Users: {
    currentUser: {},
    users: [] // index 0 is always for Head
  },
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null
};

module.exports = AppState;


