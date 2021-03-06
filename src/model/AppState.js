'use strict';
var EVENT = require('./model').socketEvents;
var CanvasStage = require('./CanvasStage');

// Every new tool will have these defaults settings
// Can be changed by user for her preferences later
var Tools = {
  // Currently selected tool from the ToolBar
  selected: '',
  Colors: {
    fill: 0xffffff,
    line: 0x000000
  },
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
    font: '12px Arial',
    fontSize: 12,
    fontFamily: 'Arial',
    stroke: 0xff1010,
    align: 'left',
    strokeThickness: 1,
    // wordWrap: true,
    // wordWrapWidth: 600,
    textContent: 'Textbox',
    // Rectangle class properties
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0xFF0000,
    fillAlpha: 1
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
    cols: 4,
    rows: 4,
    lineColor: 0x000000,
    lineWidth: 1,
    lineAlpha: 1,
    fillColor: 0xFFFFFF,
    fillAlpha: 1,
    cellDefaults: {
      font: '12px Arial',
      fontSize: 12,
      fontFamily: 'Arial',
      stroke: 0xff1010,
      align: 'left',
      strokeThickness: 1,
      // wordWrap: true,
      // wordWrapWidth: 600,
      textContent: 'Textbox',
      // Rectangle class properties
      lineColor: 0x000000,
      lineWidth: 1,
      lineAlpha: 1,
      fillColor: 0xFF0000,
      fillAlpha: 1
    }
  },
  uml: {}
};

/**
 * Shapes holds all the Drawn objects on Canvas and stage, but it organizes
 * it by hashkeys (ObjectIds), this will ensure each Shape created can be uniquely
 * identified and quick to access
 */
function Shapes() {
  this._shapeTypes = {
    'pencil': 0,
    'line': 0,
    'rectangle': 0,
    'ellipse': 0,
    'textbox': 0,
    'table': 0
  };
  this.hashKeys = ['#', '@', '&', '*', '%']; // These are scrambler characters to make Key more unique
};

Shapes.prototype = {
  addNew: function(shapeObject) {
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

    // Set object in Shape Map
    this[shapeObject._id] = shapeObject;

    // Add stage/layer level the shape will be inserted at
    this.stage.addChild(shapeObject.getGraphics());//, shapeObject.layerLevel);

    // Set the number of Shapes of this type that have been drawn so far
    this._shapeTypes[shapeObject.shapeType] = shapeCount;

    return shapeObject;
  },
  removeShape: function(shapeObject) {
    this.removeShapeByID(shapeObject._id);
  },
  removeShapeByID: function(id) {
    var shape = this[id];
    if(shape) {
      this._shapeTypes[shape.shapeType]--;

      this.stage.removeChild(shape.graphics);

      this[id] = null;
    }
  }
};

Object.defineProperty(Shapes.prototype, 'originalUser', {
  get: function() {
    return AppState.Users.currentUser._id || 'unknown';
  }
});

// AppState Main Object
var AppState = {
  sessionId: '',
  Canvas: {
    _stage: null, // private property, accessed through getter AppState.Canvas.stage, set value by AppState.Canvas.stage = new PIXI.Stage(color)
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: new Shapes()
  },
  Tools: Object.preventExtensions(Tools),
  ToolBar: {}, // Will be attached in whiteboard/index.js init method
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
  UserManagement: undefined, // Will be attached in usermanagement.js init method
  Settings: {
    interactive: true // A flag that is set or unset when User gains or looses permission
  }, // General settings, ie. styles or themes
  Messages: [],
  Socket: null, // Will be added later, in toolbar js or AppState.init method
  clearShapes: function() {
    this.Canvas.stage.removeChildren();
    this.Canvas.Shapes = new Shapes();
  },
  GlobalEvents: {}
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
    PIXI.dontSayHello = true;
    var curSession = window.location.href;
    curSession = curSession.split('/');
    var end = curSession.length -1;
    var curSessionId = curSession[end];
    var _this = this;
    var stage = new PIXI.Stage(0x858585, true);
    var renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,
                                           document.body.offsetHeight  - 60,
                                           { antialias: true });

    var canvasContainer = new CanvasStage(renderer.width, renderer.height);

    this.Canvas.stage = canvasContainer;
    this.Canvas.pixiStage = stage;
    this.Canvas.renderer = renderer;
    this.Socket = Socket;
    this.Canvas.Shapes.stage = canvasContainer;
    this.Canvas.Shapes.socket = Socket;
    this.sessionId = curSessionId;
    Container.appendChild(renderer.view);

    stage.addChild(canvasContainer);

    // Start the render loop
    animate();

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(stage);
    }
  }
});

module.exports = AppState;





