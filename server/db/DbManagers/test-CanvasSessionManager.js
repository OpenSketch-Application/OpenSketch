var test = require('tape');
var Promise = require('bluebird');
var dbShapes = require('./CanvasShapesManager');
var SeedDb = require('../seedDatabase/seedDatabase');
var CanvasSession = require('../../db/models/CanvasSession');


test('Test Database Seeding', function(t) {

  var promise = SeedDb.seedDb();

  promise
    .then(function(res) {
      if(!res.length) {
        console.log('no results found');
        SeedDb.database.close();
        throw new Error('no results found');
      }

      console.log('results', res);
      t.ok(res.length === 1, 'Results are correct');
    })
    .then(function(res) {
      t.test('Testing Canvas Session CRUD methods', subTest_CreateShape(t));
    })
    .then(function(res) {
      SeedDb.database.close();
      t.end();
    }, function(err) {
      SeedDb.database.close();
      t.fail('Error Thrown: ' + err);
      t.end();
    });
});

function subTest_CreateShape(t) {
  //console.log(db);
  t.ok(dbShapes && typeof dbShapes === 'object', 'Canvas Session manager has loaded');
  t.ok(dbShapes.init && typeof dbShapes.init === 'function', 'DbShapes has init method');
  dbShapes.init({}, 'session1');

  t.ok(dbShapes.canvasSessionId && dbShapes.canvasSessionId === 'session1', 'Id "session1" found');

  t.ok(dbShapes.findOne && typeof dbShapes.findOne === 'function', 'findOne or findOne method exists');

  dbShapes.findOne('0', function(err, result) {
    if(err) throw new Error('CanvasShape findOne: ' + err);

    t.ok(result && result.length, 'findOne returned expected result');
  });

  dbShapes.findAll(function(err, result) {
    if(err) throw new Error('CanvasShape findAll: ' + err);

    console.log(result);

    t.ok(result && result.length, 'findAll returned results');
  });

  t.ok(dbShapes.addOne, 'addOne method exists');

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

  dbShapes.addOne(rect, function(err, result) {
    if(err) throw new Error('CanvasShape findAll: ' + err);

    console.log(result);
  });


  // promise.then(function(res) {
  //   t.ok('Object saved ' + res);
  // }, function(err) {
  //   t.fail('Error: ' + err);
  // })
  // t.test('Testing promise results', function(t) {
  //   promise.then(function(res) {
  //     t.ok(res.length === 0, 'No results should be found');
  //     t.end();
  //   }, function(err) {

  //     throw new Error('Find found no results');
  //   })
  // })

  //t.ok()
  //dbShapes.close();
  //SeedDb.database.close();
  //t.end();
}

// test('Testing Canvas Session CRUD methods', function(t) {

// });





















