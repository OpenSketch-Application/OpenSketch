'use strict';
var Db = require('../../db/models/CanvasSession');

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
Shapes.findOne = function(id, callback) {
  Db
    .find(
      {'canvasId' : _this.canvasSessionId},
      { 'canvasShapes': 1, '_id': 0 }
    )
    .exec(callback);
};

Shapes.findAll = function(callback) {
  Db
    .aggregate(
      { $match: { 'canvasId' : _this.canvasSessionId } },
      { $project: { _id: false, 'canvasShapes': true } }
    )
    .exec(function(err, res) {
      if(err || !res[0] && !res[0].canvasShapes) callback(err, res);
      //console.log(res);
      callback(err, res)
    });
};

Shapes.findSome = function(criteria, callback) {
  Db
    .aggregate(
      { $match: { 'canvasId' : _this.canvasSessionId } },
      { $project: { _id: false, 'canvasShapes': true } }
    )
    .exec(function(err, res) {
      if(err) callback(err, res);

      callback(err, res);
    });
};

// db.canvassessions.aggregate({ $match: { 'canvasId' : 'session1' } },{ $project: { _id: false, 'canvasShapes': true } })

// Insert / Create methods
Shapes.addOne = function(canvasObject, callback) {
  console.log(_this.canvasSessionId);

  Db
    .findOneAndUpdate(
      { 'canvasId': _this.canvasSessionId },
      { $push: { 'canvasShapes' : canvasObject } },
      { 'new': true, 'upsert': true, 'select': { '_id': 0, 'canvasShapes': 1 } },
      function(err, res) {
        if(err) callback(err, []);

        callback(err, res.canvasShapes);
      }
    );
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

// db.canvassessions.update({ 'canvasId': 'session1' }, { $push: { 'canvasShapes': { shapeId: 'rj34kskdj43', userId: 'John0', borderStyle: null, width: 300, height: 400, layerLevel: 6, position: { x: 400, y: 500 }, rotation: 30, fillColor: '0x788945', objectType: 'Rectangle' }} })




*/
















