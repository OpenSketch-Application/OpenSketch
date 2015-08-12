//var database = require('../../db/database');
var CanvasSession = require('../../db/models/Session');

//var mongoose = require('../../node_modules/mongoose');

console.log('calling seed DB');
//console.log(CanvasSession);

module.exports = {
  database: require('../../db/database'),
  initDb: function(sessionId) {
    var sessionId = sessionId || 'session1';
    return CanvasSession.find({'_id': 'session1'})
      .then(null, function(reject) {
        return CanvasSession.create({
          _id: sessionId,
          users: [],
          dateCreated: Date.now(),
          dateUpdated: Date.now(),
          sessionProperties: {},
          canvasShapes: [],
          messages: []
        })
      })
  },
  seedDb: function() {
    return CanvasSession.remove()
      .then(function() {
        return CanvasSession.create({
          _id: 'session1',
          users: [],
          dateCreated: Date.now(),
          dateUpdated: Date.now(),
          sessionProperties: {},
          canvasShapes: [],
          messages: []
        });
      })
      .then(function(res) {
        return CanvasSession.find({'_id': 'session1'}).exec();
      })
  },
  seedUsers: function(sessionId) {
    return CanvasSession.find({'_id': 'session1'}).exec()
      .then(function(session) {

      })

  },
  seedShapes: function(sessionId) {
    var sessionId = sessionId || 'session1';
  }
}






