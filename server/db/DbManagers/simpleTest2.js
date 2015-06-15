var dbShapes = require('./CanvasShapesManager');
var SeedDb = require('../seedDatabase/seedDatabase');
var database = require('../database');

var Promise = require('bluebird');


SeedDb.seedDb()
.then(function() {
  dbShapes.init({}, 'session1');
})

new Promise(function(resolve, reject) {
  dbShapes.findOne('rj34kskdj43', function(err, res) {
  if(err) reject(err);//reject(err);//throw new Error();

    console.log(res);

    resolve();
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    dbShapes.findAll(function(err, res) {
      if(err) reject(err);

      console.log(res);

      resolve();
    });
  });
})
.then(function() {
  database.close();
})
.catch(function(err) {
  console.log('Error thrown ' + err);
})





