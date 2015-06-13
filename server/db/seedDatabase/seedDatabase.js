//var database = require('../../db/database');
var CanvasSession = require('../../db/models/CanvasSession');
//var mongoose = require('../../node_modules/mongoose');

console.log('calling seed DB');
//console.log(CanvasSession);

module.exports = {
  database: require('../../db/database'),
  seedDb: function() {
    return CanvasSession.remove()
      .then(function() {
        return CanvasSession.create({
          canvasId: 'session1',
          users: {},
          dateCreated: Date.now(),
          dateUpdated: Date.now(),
          sessionProperties: {},
          canvasModel: {},
          canvasShapes: [],
          messages: []
        });
      })
      .then(function(res) {
        return CanvasSession.find({'canvasId': 'session1'}).exec();
      })
  }
}

// .then(function(res) {
//   if(!res.length) {
//     console.log('no results found');
//     database.close();
//     throw new Error('no results found');
//   }
//   console.log('results', res);

//   return
//     //database.close();
// })

//createCanvasSession(testDb);






