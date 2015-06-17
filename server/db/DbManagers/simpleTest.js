//var dbShapes = require('./CanvasShapesManager');
var Session = require('../models/Session');
// var User = require('../models/User');
// var Shape = require('../models/Shape');

//var SeedDb = require('../seedDatabase/seedDatabase');
var database = require('../database');
//dbShapes.init({}, 'session1');
var Promise = require('bluebird');


var rect = {
  _id: 'sdfhjsdkf34',
  userId: 'MyObjectThatHasBeenAltered',
  borderStyle: { 'prop1': 'solid', 'prop2': 'red' },
  width: 800,
  height: 900,
  layerLevel: 6,
  position: { x: 400, y: 500 },
  rotation: 30,
  fillColor: '0x788945',
  objectType: 'Rectangle'
}

var rect1 = {
  _id: 'opensketch101',
  userId: 'John0',
  borderStyle: null,
  width: 300,
  height: 400,
  layerLevel: 6,
  position: { x: 900, y: 500 },
  rotation: 30,
  fillColor: '0x788945',
  objectType: 'Rectangle'
}

function findOne(id, shapeId, callback) {
  Session.findOne(id, function(err, session) {
    callback(err, session.canvasShapes.id(shapeId));
  });
}

function findAll(id, callback) {
  Session.findById(id, function(err, session) {
    callback(err, session.canvasShapes);
  });
}

function removeAll(id, callback) {
  Session.update(
    {'_id' : id },
    { $unset: { 'canvasShapes': '' } },
    {
      'new': true,
      'upsert': true
    },
    callback
  );
}

function removeOne(id, shapeId, callback) {
  Session.update(
    {
      '_id' : id,
      'canvasShapes._id': shapeId
    },
    {
      $unset: { 'canvasShapes.$': '' }
    },
    callback
  )
}

function addOne(id, shape, callback) {
  Session.findById(id, function(err, session) {

    session.canvasShapes.push(shape);

    session.save(function(err) {
      if(err) {
        console.log('err in adding', err);
        return;
      }

      callback(err, shape);
    })
  })
}

function addAll(id, shapes, callback) {
  if(!shapes.length) callback('addAll: Canvas Objects need to be in array', null);
  Session.findById(id, function(err, session) {

    session.canvasShapes.addToSet.apply(session.canvasShapes, shapes);

    session.save(function(err) {
      callback(err, shapes);
    })
  })
}

function updateOne(id, shapeId, newShape, callback) {
  Session
    .findOneAndUpdate(
      {
        '_id': id,
        'canvasShapes._id': shapeId
      },
      {
        $set: {
          'canvasShapes.$' : newShape
        }
      },
      callback
    )
}
//addOne('session2', rect, setCallback);

//removeAll('session2', setCallback);

//findOne('session2', 'opensketch101', setCallback);
new Promise(function(resolve, reject) {
  Session.findById('session2', function(err, res) {
    //console.log(res);

    if(res)
      Session.findOneAndRemove({'_id' : 'session2'}, function(err, res) {
        if(err) reject(err);
        resolve(res);
      });
    else {
      resolve();
    }
  })
})
.then(function() {
  // if(result) {
  //   return new Promise(function(resolve, reject) {
  //   })
  // }
  return new Promise(function(resolve, reject) {
    new Session({
      _id: 'session2',
      canChat: true,
      canDraw: true,
      maxUsers: 4,
      users: [
        {
          _id: 'Benson101',
          username: 'Benson',
          permissions: {
            canDraw : true,
            canChat : true
          },
          userRank: 1
        },
        {
          _id: 'Ragu101',
          username: 'Ragu',
          permissions: {
            canDraw : true,
            canChat : false
          },
          userRank: 2
        }
      ]
    })
    .save(function(err) {
      if(err) {
        console.log('Failed to create session');
        reject();
      }
      console.log('Created session');
      resolve();
    })
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    findAll('session2', setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    removeAll('session2', setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    addAll('session2', [rect, rect1], setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    findOne('session2', 'opensketch101', setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    findOne('session2', 'MySketchObject', setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    var updatedProps = {
      _id: 'MySketchObject',
      userId: 'Ragu021',
      borderStyle: { 'prop1': 'solid', 'prop2': 'red' },
      width: 40,
      height: 400,
      layerLevel: 6,
      position: { x: 900, y: 200 },
      rotation: 30,
      fillColor: '0x788945',
      objectType: 'Ellipse'
    }
    updateOne('session2', 'opensketch101', updatedProps, setCallback(resolve, reject));
  })
})
.then(function() {
  return new Promise(function(resolve, reject) {
    findOne('session2', 'MySketchObject', setCallback(resolve, reject));
  })
})
.then(function() {
  database.close();
})

function setCallback(resolve, reject) {
  return function(err, res) {
    if(err) console.log('FAILED') && reject();
    console.log(res);
    resolve();
  }
}






