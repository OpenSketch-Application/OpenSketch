var mongoose = require('mongoose');

// Create a session model, _id will be assigned by Mongoose
var CanvasSessionSchema = new mongoose.Schema({
  canvasId: String,
  dateCreated: Date,
  dateUpdated: Date,
  sessionProperties: { type: Object },
  users: Array,
  canvasShapes: Array,
  messages: Array
});

// Make Session available to rest of the application
module.exports = mongoose.model('CanvasSession', CanvasSessionSchema);

user = {
  userId: 'socket123', // socket Id
  username: 'Ragu', //'username',
  userRank: 5, //'0 - maxNum'
  permissions : {
    canDraw: true,
    canChat: true
  }
}

// sessionProperties = {

// }
