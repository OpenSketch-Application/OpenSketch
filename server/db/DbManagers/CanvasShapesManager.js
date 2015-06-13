'use strict';
var Db = require('../../db/models/CanvasSession');

var CanvasShapes = {
  socket: null, // Instanstiated on init
  canvasSessionId: 0 // Instanstiated on init
};

var _this = CanvasShapes;

CanvasShapes.init = function(socket, canvasSessionId) {
  // Attach Socket to emit events
  _this.socket = socket;
  _this.canvasSessionId = canvasSessionId;
};

// Query or Retrieve methods
CanvasShapes.one = function(id) {
  return Db
    .find(
      {'canvasId' : _this.canvasSessionId},
      { 'canvasShapes': 1, '_id': id }
    )
    .exec();
};

CanvasShapes.all = function() {
  return Db
    .aggregate(
      { $match: { 'canvasId' : _this.canvasSessionId } },
      { $project: { _id: false, 'canvasShapes': true } }
    ).exec();
};

// db.canvassessions.aggregate({ $match: { 'canvasId' : 'session1' } },{ $project: { _id: false, 'canvasShapes': true } })

CanvasShapes.some = function(criteria, callback) {};

// Insert / Create methods
CanvasShapes.add = function(canvasObject, callback) {
  console.log(_this.canvasSessionId);

  Db
    .findOneAndUpdate(
      { 'canvasId': _this.canvasSessionId },
      { $push: { 'canvasShapes' : canvasObject } },
      { 'new': true, 'upsert': true },
      callback
    )

    // .exec(function(err, res) {
    //   if(err) throw new Error('Unable to find CanvasSession');
    //   console.log(canvasObject);
    //   res.canvasShapes.push(canvasObject);

    //   res.save();
    // });
    // .exec()
    // .then(function(res) {
    //   console.log(res);
    //   res.cavnasShapes.push(canvasObject);
    //   res.save();
    //   // res.save(function(err) {
    //   //   if(err) throw new Error('Failed to save CanvasShape: ' + err);
    //   // });
    // })
}

// db.canvassessions.update({ 'canvasId': 'session1' }, { $push: { 'canvasShapes': { shapeId: 'rj34kskdj43', userId: 'John0', borderStyle: null, width: 300, height: 400, layerLevel: 6, position: { x: 400, y: 500 }, rotation: 30, fillColor: '0x788945', objectType: 'Rectangle' }} })





















module.exports = CanvasShapes;
