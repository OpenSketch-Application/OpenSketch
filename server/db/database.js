var mongoose = require('mongoose');
var assert = require('assert');
var dbConf = require('../config/dbConf');
var Connection;

// open connection with uri
mongoose.connect(dbConf.getUri());

module.exports = Connection = mongoose.connection;

// Setup basic listeners for main events
Connection.on('open', function() {
  console.log('connection opened');

});

// Setup basic events that we can listen on
Connection.on('connected', function() {
  console.log('connection made');
});

Connection.on('disconnected', function() {
  console.log('disconnected from database');
});

Connection.on('error', function() {
  console.log('error in connection');
});





