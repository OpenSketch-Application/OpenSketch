var express = require('express');
var app = express();
require('./routes/routes.js')(app); // set up routes
var server = require('http').Server(app);
var bodyParser = require('./node_modules/body-parser');
var io = require('socket.io')(server);
var enableDestroy = require('server-destroy');

// set default port number
var port = 8087;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/../app'));
//app.use(express.static(__dirname + '/app/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// listen on port using http server instance
server.listen(port, function() {
  console.log("Express Server running on port " + port);
});

// Enables a server.destroy method that destroys all open connections
enableDestroy(server);

// Start socket.io and listen for events
var socketHandler = require('./socketHandlers/socketHandler')(io);

// Make server app available as export
exports = module.exports = server;
