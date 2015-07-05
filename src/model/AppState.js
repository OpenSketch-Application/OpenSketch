'use strict';
var EVENT = require('./model').socketEvents;
// Every new tool will have these defaults settings
// Can be changed by user for her preferences later
var Tools = {
  // Currently selected tool from the ToolBar
  selected: '',
  importer: {
    maxSize: 5
  },
  fill: {
    fillColor: 0xFF0000
  },
  pencil: {
    fillColor: 0x000000,
    strokeWidth: 1,
    lineColor: 0x000000,
    lineWidth: 2,
    lineAlpha: 1

  },
  select: {
    clickedObject: false,
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
    fillAlpha: 1
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
  removeShapeByID: removeShapeByID,
  _shapeTypes: {},
  _shapes: {},
  _order: [],
  hashKeys: ['#', '@', '&', '*', '%']
};

Object.defineProperty(Shapes, 'originalUser', {
  get: function() {
    return AppState.Users.currentUser._id || 'unknown';
  }
})

// Methods for User Layer
// function insertAt(shape, index) {
//   var oldIndex = 0;
//   // Check if shape exists already
//   if(this._shapes[shape._id]) {
//     oldIndex = this._shapes.layerLevel;
//   }
// }

// function removeAt() {}
// function reorder(start, end) {
//   var orderedArray = this._order;
//   var i = start;
// }

// Use test case to ensure userId, canvasID and Object Type are set
// userId: AppState.Users.currentUser._id,
function addNew(shapeObject, layerLevel, shapeID) {
  // increment object type number
  var shapeNumRef = this._shapeTypes[shapeObject.objectType];
  var keyIndex = 0;

  shapeObject.originalUserId = shapeObject.originalUserId || this.originalUser;
  shapeObject.currentUserId = shapeObject.originalUserId;

  if(!isNaN(shapeNumRef)) {
    shapeNumRef++;
  }
  else {
    shapeNumRef = 0;
  }

  // Create Unique key
  shapeObject._id = shapeObject._id || '_' + shapeObject.objectType +
                    shapeNumRef +
                    shapeObject.originalUserId.substr(0,3);

  while(this[shapeObject._id]) {
    shapeNumRef = shapeNumRef%2 === 0 ? shapeNumRef + 1
                                    : shapeNumRef;
    shapeObject._id = shapeObject._id + shapeObject.hashKeys[keyIndex] + shapeNumRef;
    keyIndex = ++keyIndex%5;
  }

  shapeObject.layerLevel = layerLevel || this.stage.children.length;

  // Set object in Shape Map
  this[shapeObject._id] = shapeObject;

  // Add stage/layer level the shape will be inserted at
  this.stage.addChildAt(shapeObject.graphics, shapeObject.layerLevel);

  this._shapeTypes[shapeObject.objectType] = shapeNumRef;

  console.log('ADD NEW', shapeObject);
  return shapeObject;
}

// Removes shape based on id
function removeShapeByID(id) {
  var shape = this[id];
  console.log('shape to remove', shape);
  if(shape) {
    this._shapeTypes[shape.objectType]--;

    this.stage.removeChildAt(shape.layerLevel);

    this[id] = null;
  }
}

// Removes entire shape by reference
function removeShape(shapeObject) {
  this.removeShapeByID(shapeObject._id);
}

// AppState Main Object
var AppState = {
  Canvas: {
    _stage: null,
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: Shapes,
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

// Defines a more specific setter and getter for Canvas stage
Object.defineProperty(AppState.Canvas, "stage", {

  get: function () {
    return this._stage;
  },

  set: function (stage) {
    this._stage = stage;
    this.Shapes.stage = stage;
  }

});

module.exports = AppState;


