var mongoose = require('mongoose');
var dbConf = require('../../config/dbConf');
var Session = require('../models/Session');
var CanvasShapesManager = require('../DbManagers/CanvasShapesManager');
// open connection with uri
mongoose.connect(dbConf.getUri());

var Connection = mongoose.connection;

Connection.on('open', function() {
    mongoose.connection.db.dropDatabase();

    mongoose.connection.close();
})

