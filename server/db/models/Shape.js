var mongoose = require('mongoose');

// Base Model for Canvas Object
// Will be a subdocument, to be stored inside CanvasSessions
module.exports = new mongoose.Schema({
  _id: String,
  userId: String,
  objectType: String,
  layerLevel: Number,
  position: {
    x: Number,
    y: Number
  },
  width: Number,
  height: Number,
  rotation: Number,
  fillColor: String,
  borderStyle: { type: Object }
});
