'use strict';
var Session = require('../../db/models/Session');

var Shapes = {
  socket: null, // Instanstiated on init
  canvasSessionId: 0 // Instanstiated on init
};

var _this = Shapes;

Shapes.init = function(socket, canvasSessionId) {
  // Attach Socket to emit events
  _this.socket = socket;
  _this.canvasSessionId = canvasSessionId;
};

// Query or Retrieve methods
Shapes.findOne = function(id, shapeId, callback) {
  Session.findOne(
    {
      '_id': id
    },
    {
      'canvasShapes' : {
        $elemMatch: {
          '_id' : shapeId
        }
      }
    },
    {
      _id: false,
      'canvasShapes': true
    },
    function(err, result) {
      //console.log('err',err);
      //console.log('res:',result);
      callback(err, result);

 //     callback(err, result.canvasShapes.length && result.canvasShapes[0]);
    }
  );
};

Shapes.findAll = function(id, callback) {
  Session.findById(id, function(err, session) {
    callback(err, session.canvasShapes);
  });
};

Shapes.findSome = function(criteria, callback) {
  Session
    .aggregate(
      { $match: { 'canvasId' : _this.canvasSessionId } },
      { $project: { _id: false, 'canvasShapes': true } }
    )
    .exec(function(err, res) {
      if(err || !res[0] && !res[0].canvasShapes) throw new Error(err);

      callback(err, res[0].canvasShapes);
    });
};

// db.canvassessions.aggregate({ $match: { 'canvasId' : 'session1' } },{ $project: { _id: false, 'canvasShapes': true } })

// Insert / Create methods
Shapes.addOne = function(id, shape, callback) {
  Session.findById(id, function(err, session) {
    console.log('adding shape to collection');
    session.canvasShapes.push(shape);

    session.save(function(err) {

      callback(err, shape);
    });
  })
}

Shapes.addAll = function(id, shapes, callback) {
  if(!shapes.length) callback('addAll: Canvas Objects need to be in array', null);
  Session.findById(id, function(err, session) {

    session.canvasShapes.addToSet.apply(session.canvasShapes, shapes);

    session.save(function(err) {
      callback(err, session.canvasShapes);
    })
  })
}

Shapes.updateOne = function(id, shapeId, newShape, callback) {
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
      {
        'new': true,
        'select': {
          '_id': false,
          'canvasShapes': {
            $elemMatch : {
              '_id': newShape._id
            }
          }
        }
      },
      function(err, result) {
        callback(err, result);
        
        console.log('updating a shape');
      //  callback(err, result && result.canvasShapes.length && result.canvasShapes[0]);
      }
    )
}

// .deleteOne()
Shapes.deleteOne = function(id, shapeId, callback) {
  Db.update(
    {
      '_id': id,
      'canvasShapes._id': shapeId
    },
    {
      $unset: { 'canvasShapes.$': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}


/**
 * [deleteSome description]
 * @param  {[String]}   id         the _id of Session
 * @param  {[Shape]}   properties  the
 * @param  {Function} callback   [description]
 * @callback (err, result)            [description]
 * @result { ok: Boolean, nModified: Number, n: Number }
 */
Shapes.deleteSome = function(id, properties, callback) {
  Db.update(
    {
      '_id': id,
      'canvasShapes':  { $elemMatch : properties }
    },
    {
      $unset: { 'canvasShapes.$': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}

// .deleteAll()
Shapes.deleteAll = function(id, callback) {
  Db.update(
    {
      '_id': id
    },
    {
      $unset: { 'canvasShapes': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}

module.exports = Shapes;

/*
Db.session
  .findOne()
  .findAll()
  .findSome()

  .addOne()
  .addAll()

  .updateOne()
  .updateAll()
  .updateSome()

  .deleteOne()
  .deleteSome()
  .deleteAll()

// Need to set SessionId for the Canvas Session we wish to query
Db.shapes
  .findOne()
  .findAll()
  .findSome()

  .addOne()
  .addAll()

  .updateOne()
  .updateAll()
  .updateSome()

  .deleteOne()
  .deleteSome()
  .deleteAll()

Db.users
  .findOne()
  .findAll()
  .findSome()

  .addOne()
  .addAll()

  .updateOne()
  .updateAll()
  .updateSome()

  .deleteOne()
  .deleteSome()
  .deleteAll()

Db.messages
  .findOne()
  .findAll()
  .findSome()

  .addOne()
  .addAll()

  .updateOne()
  .updateAll()
  .updateSome()

  .deleteOne()
  .deleteSome()
  .deleteAll()

// db.canvassessions.update({ 'canvasId': 'session1' }, { $push: { 'canvasShapes': { shapeId: 'rj34kskdj43', shapeId: 'John0', borderStyle: null, width: 300, height: 400, layerLevel: 6, position: { x: 400, y: 500 }, rotation: 30, fillColor: '0x788945', objectType: 'Rectangle' }} })




*/
















