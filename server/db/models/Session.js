var mongoose = require('mongoose');

var Shape = require('./Shape');
var User = require('./User');

// Create a session model, _id will be assigned by Mongoose
var CanvasSessionSchema = new mongoose.Schema(
  {
    _id: String,
    users: [User],
    dateCreated: Date,
    dateUpdated: Date,
    // canDraw: Boolean,
    // canChat: Boolean,
    // maxUsers: Number,
    sessionProperties: {
      canDraw: Boolean,
      canChat: Boolean,
      maxUsers: Number
    },
    //canvasModel: { type: Object },
    canvasShapes: { type: Array, unique: true, index: true },
    messages: Array
  },
  { autoIndex: false }
);

// Make Session available to rest of the application
module.exports = mongoose.model('Session', CanvasSessionSchema);
