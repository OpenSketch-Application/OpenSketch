var express = require('express');
var app = express();
//var server = require('http').Server(app);

// set default port number
var port = process.env.PORT || 8080;

// set the static files location /public/img will be /img for users
app.use(express.static('../client/app/'));

// Set route handlers
require('./routes/routeTest')(app);

// listen on port
app.listen(port, function() {
  console.log("Express Server running on port " + port);
});

// Make server app available as export
exports = module.exports = app;
