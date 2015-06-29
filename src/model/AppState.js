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
    Shapes: {},
    //ActiveShapes: {}, // Locks for shapes being handled by multiple users
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
    templates: {

    },
    table: {
    }
  },

  /*
  // this.shape = {
  //   _id: '',
  //   userId: '',
  //   layerLevel: 0,
  //   rotation: 0,
  //   interactive: false,
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  //   lineWidth: 0,
  //   lineColor: 0,
  //   fillColor: 0,
  //   lineAlpha: 0,
  //   fillAlpha: 0
  // }
   */
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
function addNew(ShapeObject) {
  switch(ShapeObject.objectType) {
    case 'rectangle':
      break;
    case 'pencil':
      break;
    case 'ellipse':
      break;
    case 'text':
      break;
  }
  //shapeObject.objectType = objectType;
  //shapeObject.graphics = graphics;
}

// userId: AppState.Users.currentUser._id,
function shapeHasher(shapeObject) {
  // increment object type number
  var shapeNumRef = this._shapeTypes[objectType];
  //var shapeObject = {};
  shapeObject.userId = shapeObject.userId || AppState.Users.currentUser._id;


  if(!isNaN(shapeNumRef)) {
    shapeNumRef++;
  }
  else {
    shapeNumRef = 0;
  }

  // Create Unique key
  shapeObject._id = objectType.substr(0,3) +
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


function addSocketShape(shapeObject) {

}

module.exports = AppState;


