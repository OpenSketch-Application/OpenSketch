var path = require('path');

module.exports = function(app) {
  var viewdir = path.resolve(__dirname + '/../../client/app/views');

  // GET
  app.get('/', function(req, res, next) {
    console.log('home request received');
    console.log('send more');
    console.log('hello');

    res.sendFile('index.html');
  });

  app.get('/login', function(req, res, next) {
    res.sendFile(viewdir + '/login.html');
  });

  app.post('/login', function(req, res, next) {
    res.send('email: ' + req.body.email + '\npassword:' + req.body.password);
  });

  app.get('/landing', function(req, res, next) {
    res.sendFile(viewdir + '/landing.html');
  });
};
