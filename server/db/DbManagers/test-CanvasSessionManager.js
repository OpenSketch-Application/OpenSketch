var test = require('tape');
var Promise = require('bluebird');
var dbShapes = require('./CanvasShapesManager');
var SeedDb = require('../seedDatabase/seedDatabase');

var SESSION_ID = 'session1';
var TestUser = require('../../tests/DbTests/subTest_User');

test('Test Database Seeding', function(t) {

  var promise = SeedDb.seedDb();
  //t.plan(3);
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
      t.test('Testing Shapes methods', subTest_CreateShape);
    })
});

function subTest_CreateShape(t) {
  //dbShapes.createIndex({ "canvasShapes._id": true });
  t.ok(dbShapes && typeof dbShapes === 'object', 'Canvas Session manager has loaded');
  t.ok(dbShapes.init && typeof dbShapes.init === 'function', 'DbShapes has init method');

  dbShapes.init({}, SESSION_ID);

  t.ok(dbShapes.canvasSessionId && dbShapes.canvasSessionId === SESSION_ID, 'Id ' + SESSION_ID +  ' found');

  new Promise(function(resolve, reject) {
    t.ok(dbShapes.findAll && typeof dbShapes.findAll === 'function', 'findAll method exists');

      dbShapes.findAll(SESSION_ID, function(err, res) {
        if(err) reject(err);

        console.log('findAll', res);

        t.ok(typeof res === typeof [] && res.length === 0, 'findAll returned');

        resolve();
      });
  })
  .then(function() {
    t.ok(dbShapes.findOne && typeof dbShapes.findOne === 'function', 'findOne method exists');

    return new Promise(function(resolve, reject) {

      dbShapes.findOne(SESSION_ID, 'rj34kskdj43', function(err, res) {
        if(err) reject(err);//reject(err);//throw new Error();

        console.log('findOne', res);
        t.ok(!res, 'findOne returned false');
        resolve();
      })
    })
  })
  .then(function() {
    t.ok(dbShapes.addOne && typeof dbShapes.addOne === 'function', 'addOne method exists');
    var rect = {
      _id: 'rj34kskdj73',
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
    return new Promise(function(resolve, reject) {
      dbShapes.addOne(SESSION_ID, rect, function(err, res) {
        if(err) reject(err);

        console.log('addOne', res);

        t.ok(res && res._id && res._id === 'rj34kskdj73', 'addOne added an shape object');

        resolve();
      });
    });
  })
  .then(function() {
    t.ok(dbShapes.addAll && typeof dbShapes.addAll === 'function', 'addAll method exists');

    var shapes = [
      {
        _id: 'rj34kskdjP3',
        userId: 'John0',
        borderStyle: null,
        width: 300,
        height: 400,
        layerLevel: 6,
        position: { x: 400, y: 500 },
        rotation: 30,
        fillColor: '0x788945',
        objectType: 'Rectangle'
      },
      {
        _id: '1sdhfjk34',
        userId: 'John0',
        borderStyle: null,
        width: 500,
        height: 700,
        layerLevel: 2,
        position: { x: 400, y: 500 },
        rotation: 30,
        fillColor: '0x788945',
        objectType: 'Rectangle'
      },
      {
        _id: 'sdfhjsdkf34',
        userId: 'John0',
        borderStyle: { 'prop1': 'solid', 'prop2': 'red' },
        width: 300,
        height: 400,
        layerLevel: 2,
        position: { x: 600, y: 500 },
        rotation: 30,
        fillColor: '0x788945',
        objectType: 'Ellipse'
      }
    ]
    return new Promise(function(resolve, reject) {
      dbShapes.addAll(SESSION_ID, shapes, function(err, res) {
        if(err) reject(err);

        console.log('addAll', res);

        t.ok(typeof res === typeof [] && res.length === 4, 'addAll returned array with 4 shapes');

        resolve();
      });
    });
  })
  .then(function() {
    return new Promise(function(resolve, reject) {

      dbShapes.findOne(SESSION_ID, 'sdfhjsdkf34', function(err, res) {
        if(err) reject(err);

        console.log('find sdfhjsdkf34', res);
        t.ok(typeof res === typeof {} && res._id && res._id === 'sdfhjsdkf34', 'findOne returned object with id sdfhjsdkf34');
        resolve(res);
      })
    })
  })
  .then(function(canvasObject) {
    t.ok(dbShapes.updateOne && typeof dbShapes.updateOne === 'function', 'updateOne method exists');
    t.ok(canvasObject && canvasObject._id && canvasObject._id === 'sdfhjsdkf34', 'Got Shape with Id: ' + 'sdfhjsdkf34')
    var shape = {
      _id: 'sdfhjsdkf34',
      userId: 'John0',
      borderStyle: null,
      width: 600,
      height: 600,
      layerLevel: 2,
      position: { x: 800, y: 100 },
      rotation: 0,
      fillColor: '0xFF00FF',
      objectType: 'Ellipse'
    }

    return new Promise(function(resolve, reject) {
      dbShapes.updateOne(SESSION_ID, canvasObject._id, shape, function(err, res) {
        if(err) reject(err);

        console.log('updateOne', res);

        t.ok(typeof res === typeof shape && res._id && res._id === shape._id, 'update returned a shape object');
        for(var property in shape) {
          if(shape.hasOwnProperty(property)) {
            t.notOk(res[property] === undefined || res[property] != shape[property], 'Property: ' + property + ' res[property]' + res[property] + ', shape[property]: ' + shape[property]);
          }
        }
        resolve();
      });
    });
  })
  .then(function() {
    var shape = {
      _id: 'sdfhjsdkf34',
      userId: 'John0',
      borderStyle: null,
      width: 600,
      height: 600,
      layerLevel: 2,
      position: { x: 800, y: 100 },
      rotation: 0,
      fillColor: '0xFF00FF',
      objectType: 'Ellipse'
    }

    return new Promise(function(resolve, reject) {
      dbShapes.updateOne(SESSION_ID, 'dfhjsdk', [], function(err, result) {
        if(err) reject(err);

        t.ok(result === null, 'Result is null, since Shape does not exist');
        resolve();
      })
    })
  })
  .then(function() {
    t.end();
    SeedDb.database.close();
  })
  .catch(function(err) {
    console.log(err);
    t.end();
    SeedDb.database.close();
  })
}





















