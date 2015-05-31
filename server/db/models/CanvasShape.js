// Base Model for Canvas Object
// Will be a subdocument, to be stored inside CanvasSessions
module.exports = {
  userId: String,
  objectType: String,
  layerLevel: Number,
  position: {
    x: Number,
    y: Number
  },
  rotation: Number,
  fillColor: {
    hexCode: String,
    rgba: String
  }
};
