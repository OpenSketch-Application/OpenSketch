var dbShapes = require('./CanvasShapesManager');
//var SeedDb = require('../seedDatabase/seedDatabase');
var database = require('../database');
dbShapes.init({}, 'session1');
var Promise = require('bluebird');
// SeedDb.seedDb()
//   .then(function(res) {

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

    //console.log('Rect', rect);
    // dbShapes.addOne(rect, function(err, res) {
    //   if(err) throw new Error('Unable to add: ' + err);

    //   console.log(res);
    //   checkAll();
    // });
  checkAll();

    function checkAll() {
      // dbShapes.findAll(function(err, res) {
      //   if(err) throw new Error('Unable to get all: ' + err);

      //   console.log('Result', res);

      //   //database.close();
      // });
      new Promise(function(resolve, reject) {
        dbShapes.findOne('rj34kskdj43', function(err, res) {
          if(err) reject(err);
          resolve(res);
        })
      })
      .then(function(results) {
        console.log(results);

        database.close();
      })
      .catch(function(e) {
        console.log('error', e);
        database.close();
      })
    }




