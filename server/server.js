var serverConf = require('./config/serverConf');
var express = require('express');
var app = express();
var enableRoutes = require('./routes/routes.js'); // set up routes
var server = require('http').Server(app);
var bodyParser = require('./node_modules/body-parser');
var io = require('socket.io')(server);
var enableDestroy = require('server-destroy');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/../app'));

// Middleware to help with parsing data from request and response body
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/*',function(req, res, next) {
  console.log('made!');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header('Content-Type', 'application/json');
    next();
});



// listen on port using http server instance
server.listen(serverConf.port, function() {
  console.log("Express Server running on port " + serverConf.port);
});

// Enables a server.destroy method that destroys all open connections
enableDestroy(server);

// Start Mongoose middleware for mongodb
var database = require('./db/database');

var testDB = [];

// Start socket.io and listen for events
var socketHandler = require('./socketHandlers/socketHandler')(io,database);


enableRoutes(app, io);

// Make server app available as export
exports = module.exports = server;
