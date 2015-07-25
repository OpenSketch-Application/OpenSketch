'use strict';
var EVENT = require('./model').socketEvents;

// Every new tool will have these defaults settings
// Can be changed by user for her preferences later
var Tools = {
  // Currently selected tool from the ToolBar
  selected: '',
  importer: {
    imageUrl: '',
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
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1
  },
  rectangle: {
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0xFFFFFF,
    fillAlpha: 1
  },
  ellipse: {
    fillColor: 0xFFFFFF,
    strokeColor: 0x000000,
    strokeWidth: 1
  },
  text: {
    // Text Properties
    font: '16px Arial',
    // fontSize: 5,
    // fontFamily: 'Arial',
    stroke: 0xff1010,
    align: 'left',
    strokeThickness: 1,
    wordWrap: true,
    wordWrapWidth: 600,
    textContent: 'This\n is \na textbox\n',
    // Rectangle class properties
    // lineColor: 0x000000,
    // lineWidth: 1,
    // lineAlpha: 1,
    // fillColor: 0xFFFFFF,
    // fillAlpha: 1
    // {font : '24px Arial',
    // fill : 0xff1010,
    // align : 'center'}
  },
  templates: {
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0xFFFFFF,
    fillAlpha: 1
  },
  table: {
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0xFFFFFF,
    fillAlpha: 1
  },
  uml: {}
};

/**
 * Shapes holds all the Drawn objects on Canvas and stage, but it organizes
 * it by hashkeys (ObjectIds), this will ensure each Shape created can be uniquely
 * identified and quick to access
 */
var Shapes = {
  addNew: addNew,
  removeShape: removeShape,
  removeShapeByID: removeShapeByID,
  _shapeTypes: {
    'pencil': 0,
    'line': 0,
    'rectangle': 0,
    'ellipse': 0,
    'textbox': 0,
    'table': 0
  },
  _shapes: {},
  _order: [],
  hashKeys: ['#', '@', '&', '*', '%'] // These are scrambler characters to make Key more unique
};

Object.defineProperty(Shapes, 'originalUser', {
  get: function() {
    return AppState.Users.currentUser._id || 'unknown';
  }
})

// Use test case to ensure userId, canvasID and Object Type are set
// layerLevel is optional parameter
function addNew(shapeObject, layerLevel) {
  // increment the number of Shapes of this type
  var shapeCount = this._shapeTypes[shapeObject.shapeType];

  // Used for scrambling the hash,
  // ie. hashKeys[keyIndex]
  var keyIndex = 0;

  shapeObject.originalUserId = shapeObject.originalUserId || this.originalUser;
  shapeObject.currentUserId = shapeObject.originalUserId;

  // Increment the count of Shapes of this type that have been drawn
  if(!isNaN(shapeCount)) {
    shapeCount++;
  }
  else {
    shapeCount = 0;
  }

  // Create Unique key
  shapeObject._id = '#_' + shapeObject.shapeType +
                    shapeCount +
                    shapeObject.originalUserId.substr(0,3);

  // Loop and attempt to create a unqiue key for this shape
  while(this[shapeObject._id]) {
    shapeCount = shapeCount%2 === 0 ? shapeCount + 1
                                    : shapeCount;
    shapeObject._id = shapeObject._id + this.hashKeys[keyIndex] + shapeCount;
    keyIndex = ++keyIndex%5;
  }

  // Set the layer level of this Shape, ie. this is its stage level on Pixi stage
  shapeObject.layerLevel = layerLevel || this.stage.children.length;

  // Set object in Shape Map
  this[shapeObject._id] = shapeObject;

  // Add stage/layer level the shape will be inserted at
  this.stage.addChildAt(shapeObject.getGraphics(), shapeObject.layerLevel);

  // Set the number of Shapes of this type that have been drawn so far
  this._shapeTypes[shapeObject.shapeType] = shapeCount;

  return shapeObject;
}

// Removes shape based on id
function removeShapeByID(id) {
  var shape = this[id];
  if(shape) {
    this._shapeTypes[shape.shapeType]--;

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
    _stage: null, // private property, accessed through getter AppState.Canvas.stage, set value by AppState.Canvas.stage = new PIXI.Stage(color)
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: Shapes
  },
  Tools: Object.preventExtensions(Tools),
  ToolBar: {},
  Users: {
    currentUser: {},
    users: [], // index 0 is always for Head
    getUserById: function(id) {
      var matchedUser;
      this.users.some(function(user) {
        if(id === user._id) {
          matchedUser = user;
          return true;
        }
        return false;
      })

      return matchedUser;
    }
  },
  ChatBox: undefined, // Will be attached in chatbox.js init method
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null // Will be added later, in toolbar js or AppState.init method
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

// Preferred way of initiatializing the AppState, should be done early and seperate
// Currently initialization is done in toolbar.js
Object.defineProperty(AppState, 'init', {
  // Pixi library instance, Socket instance, HTML div container
  value: function(PIXI, Socket, Container) {
    var _this = this;
    var stage = new PIXI.Stage(0xFFFFFF, true);
    var renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,
                                           document.body.offsetHeight  - 60,
                                           { antialias: true });

    PIXI.dontSayHello = true;

    this.Canvas.stage = stage;
    this.Canvas.renderer = renderer;
    this.Socket = Socket;
    this.Canvas.Shapes.stage = stage;
    this.Canvas.Shapes.socket = Socket;

    Container.appendChild(renderer.view);

    // Start the render loop
    animate();

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(stage);
    }
  }
});

module.exports = AppState;















