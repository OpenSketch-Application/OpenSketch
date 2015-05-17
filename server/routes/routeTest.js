module.exports = function(app) {

  // GET
  app.get('/', function(req, res, next) {
    console.log('home request received');

    res.sendFile('index.html');
  });
}
