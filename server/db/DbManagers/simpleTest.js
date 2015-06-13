var dbShapes = require('./CanvasShapesManager');
var SeedDb = require('../seedDatabase/seedDatabase');

dbShapes.init({}, 'session1');

SeedDb.seedDb()
  .then(function(res) {

      var rect = {
      shapeId: 'rj34kskdj43',
      userId: 'John0',
      borderStyle: null,
      width: 300,
      height: 400,
      layerLevel: 6,
      position: { x: 400, y: 500 },
      rotation: 30,
      fillColor: '0x788945',
      objectType: 'Rectangle'
    }

    console.log('Rect', rect);

    dbShapes.add(rect, function(err, res) {
      if(err) throw new Error('Unable to add: ' + err);

      console.log(res);
    });
  })

