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
      new Promise(function(resolve, reject) {
        dbShapes.findOne('rj34kskdj43', function(err, res) {
        if(err) reject(err);//reject(err);//throw new Error();

          //console.log(res);
          t.ok(true, 'test 1 passed');
          resolve();
        })
      })
      .then(function() {
        return new Promise(function(resolve, reject) {
          dbShapes.findAll(function(err, res) {
            if(err) reject(err);

            console.log(res);
            t.ok(true, 'test 2 passed');
            resolve();
          });
        });
      })
      //t.test('Testing Canvas Session CRUD methods', subTest_CreateShape(t));
    })
    .finally(function() {
      SeedDb.database.close();
      t.end();
    })
});

function subTest_CreateShape(t) {
  //console.log(db);
  t.plan(3 + 2);

  t.ok(dbShapes && typeof dbShapes === 'object', 'Canvas Session manager has loaded');
  t.ok(dbShapes.init && typeof dbShapes.init === 'function', 'DbShapes has init method');

  dbShapes.init({}, 'session1');

  t.ok(dbShapes.canvasSessionId && dbShapes.canvasSessionId === 'session1', 'Id "session1" found');

  new Promise(function(resolve, reject) {
    dbShapes.findOne('rj34kskdj43', function(err, res) {
    if(err) reject(err);//reject(err);//throw new Error();

      //console.log(res);
      t.ok(true, 'test 1 passed');
      resolve();
    })
  })
  .then(function() {
    return new Promise(function(resolve, reject) {
      dbShapes.findAll(function(err, res) {
        if(err) reject(err);

        console.log(res);
        t.ok(true, 'test 2 passed');
        resolve();
      });
    });
  })


  // var rect = {
  //   shapeId: 'rj34kskdj43',
  //   userId: 'John0',
  //   borderStyle: null,
  //   width: 300,
  //   height: 400,
  //   layerLevel: 6,
  //   position: { x: 400, y: 500 },
  //   rotation: 30,
  //   fillColor: '0x788945',
  //   objectType: 'Rectangle'
  // }

  // dbShapes.addOne(rect, function(err, result) {
  //   if(err) reject(err);

  //   t.ok(result && result.length, 'addOne added ' + result[0]);

  //   resolve();
  // });
  // new Promise(function(resolve, reject) {
  //   t.ok(dbShapes.addOne, 'addOne method exists');

  //   var rect = {
  //     shapeId: 'rj34kskdj43',
  //     userId: 'John0',
  //     borderStyle: null,
  //     width: 300,
  //     height: 400,
  //     layerLevel: 6,
  //     position: { x: 400, y: 500 },
  //     rotation: 30,
  //     fillColor: '0x788945',
  //     objectType: 'Rectangle'
  //   }

  //   dbShapes.addOne(rect, function(err, result) {
  //     if(err) reject(err);

  //     t.ok(result && result.length, 'addOne added ' + result[0]);

  //     resolve();
  //     //callback();
  //   });
  // })
  // .then(function() {
  //   t.ok(dbShapes.findOne && typeof dbShapes.findOne === 'function', 'findOne method exists');

  //   dbShapes.findOne('rj34kskdj43', function(err, res) {
  //     if(err) reject(err);//throw new Error();

  //     t.ok(res && res.length === 1, 'findOne returned one result');

  //     resolve();
  //   })
  // });

  // var testcases = [
  //   function(callback) {
  //     return function() {
  //       t.ok(dbShapes.findOne && typeof dbShapes.findOne === 'function', 'findOne method exists');

  //       dbShapes.findOne('rj34kskdj43', function(err, res) {
  //         if(err) throw new Error(err);//reject(err);//throw new Error();

  //         t.ok(res && res.length === 1, 'findOne returned one result');

  //         //resolve();
  //         callback();
  //       })
  //     }
  //   },
  //   function(callback) {
  //     return function() {
  //       t.ok(dbShapes.findSome && typeof dbShapes.findSome === 'function', 'findSome method exists');

  //       dbShapes.findOne('rj34kskdj43', function(err, res) {
  //         if(err) throw new Error(err);//reject(err);//throw new Error();

  //         t.ok(res && res.length === 1, 'findSome returned one result');

  //         //resolve();
  //         callback();
  //       })
  //     }
  //   },
  //   function(callback) {
  //     return function() {
  //       t.ok(dbShapes.findAll && typeof dbShapes.findAll === 'function', 'findAll method exists');

  //       dbShapes.findAll(function(err, result) {
  //         if(err) throw new Error(err);//reject(err);

  //         console.log(result);

  //         t.ok(result && result.length, 'findAll returned results');
  //         t.end();
  //         //resolve();
  //         callback();
  //       })
  //     }
  //   }
  // ];
}



















