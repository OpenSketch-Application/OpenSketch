var path = require('path');

module.exports = function(app) {
  var viewdir = path.resolve(__dirname + '/../../app');

  // GET
  app.get('/', function(req, res, next) {
    console.log('home request received');
    console.log('send more');
    console.log('hello');

    res.sendFile(viewdir + '/index.html');
  });

  app.get('/whiteboard', function(req, res, next) {
    res.sendFile(viewdir + '/whiteboard.html');
  });
  
  return app;
};
