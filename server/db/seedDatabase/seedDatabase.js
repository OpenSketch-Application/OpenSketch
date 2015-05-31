var database = require('../../db/database');
var CanvasSession = require('../../db/models/CanvasSession');

var closeDb = function() {
  database.close();
};

var createCanvasSession = function(callback) {
  console.log('canvassession created');
  new CanvasSession({
    canvasId: 0,
    users: {},
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    sessionProperties: {},
    canvasModel: {},
    canvasShapes: [],
    messages: []
  }).save(function(err) {
    if(err) throw err;

    console.log('saved');
    callback();
  });
};

// Check if collections exist
CanvasSession.find(function(res, err) {
  if(err || res.length === 0) {
    closeDb();
    throw new Error('unable to find results');
  }
  else {
    createCanvasSession(closeDb);
  }
});






