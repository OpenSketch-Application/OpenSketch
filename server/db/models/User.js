var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  _id : String,
  username : String,
  permissions: {
    canDraw : Boolean,
    canChat : Boolean
  },
  userRank: Number,
  isOnline : Boolean
});
