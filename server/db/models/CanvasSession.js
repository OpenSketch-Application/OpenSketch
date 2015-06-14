var mongoose = require('mongoose');

//user child object
var User = new mongoose.Schema({
  name : String,
  canDraw : Boolean,
  canChat : Boolean,
  _id : String
});

// Create a session model, _id will be assigned by Mongoose
var CanvasSessionSchema = new mongoose.Schema({
  canvasId: String,
  users: [User],
  dateCreated: Date,
  dateUpdated: Date,
  canDraw: Boolean,
  canChat: Boolean,
  maxUsers: Number,
  canvasModel: { type: Object },
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
