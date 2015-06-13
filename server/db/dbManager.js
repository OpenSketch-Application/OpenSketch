var database = require('../../db/database');
var CanvasSession = require('../../db/models/CanvasSession');
var seedDatabase = require('./seedDatabase/seedDatabase');

// For Development only, seeds Db with data, it will check if Db is empty, then seed
seedDatabase();

var Db = {};

Db.findOne = function(objectString, ) {

}


//CanvasSession.
module.exports = Db;

