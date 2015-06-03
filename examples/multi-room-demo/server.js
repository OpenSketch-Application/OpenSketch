var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('./node_modules/body-parser');
var io = require('socket.io')(server);
// set default port number
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// listen on port using http server instance
server.listen(port, function() {
  console.log("Express Server running on port " + port);
});

//Fake db
var db = [];
// Set route handlers
require('./routes/sessionRoutes')(app,io,db);

// Start socket.io and listen for events
var socketHandler = require('./socketHandlers/sockets')(io,db);

// Make server app available as export
exports = module.exports = server;
