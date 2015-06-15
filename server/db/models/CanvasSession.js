var mongoose = require('mongoose');
var User = new mongoose.Schema({
  name : String,
  canDraw : Boolean,
  canChat : Boolean,

  // permissions : {
  //   canDraw: true,
  //   canChat: true
  // },
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
  // sessionProperties: {
  //   canDraw: Boolean,
  //   canChat: Boolean,
  //   maxUsers: Number
  // },
  //canvasModel: { type: Object },
  canvasShapes: Array,
  messages: Array
});

// Make Session available to rest of the application
module.exports = mongoose.model('CanvasSession', CanvasSessionSchema);

// user1 = {
//   userId: 'ragu234i532', // socket Id
//   username: 'Ragu', //'username',
//   userRank: 1, //'0 - maxNum'
//   permissions : {
//     canDraw: true,
//     canChat: true
//   }
// },
// user2 = {
//   userId: 'benson234i532', // socket Id
//   username: 'Benson', //'username',
//   userRank: 2, //'0 - maxNum'
//   permissions : {
//     canDraw: true,
//     canChat: true
//   }
// },
// user3 = {
//   userId: 'james234i532', // socket Id
//   username: 'James', //'username',
//   userRank: 3, //'0 - maxNum'
//   permissions : {
//     canDraw: true,
//     canChat: true
//   }
// }

// var User = new mongoose.Schema({
//   name : String,
//   canDraw : Boolean,
//   canChat : Boolean,
//   _id : String
// });
