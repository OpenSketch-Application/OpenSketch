var path = require('path');
var shortid = require('shortid');
var serverConf = require('../config/serverConf');
var fs = require('fs');
var Busboy = require('busboy');


module.exports = function(app) {
  var viewdir = path.resolve(__dirname + '/../../app');
  

  // GET
  app.get('/', function(req, res, next) {
    res.sendFile(viewdir + '/index.html');
  });

  app.get('/whiteboard', function(req, res, next) {
    res.sendFile(viewdir + '/whiteboard.html');
  });

  app.get('/images/:id', function(req, res, next) {
    res.sendFile(path.resolve('images/' + req.params.id));
  });

  app.post('/api/upload', function(req, res){
    var savePath = serverConf.imagePath + shortid.generate() + '.jpg';
    var busboy = new Busboy({headers: req.headers});
    var chunks = [];
    var fileError = false;
    var fileExt;

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      if (mimetype.indexOf('image/')>-1) {
        fileExt = path.extname(filename);
        file.on('data', function(chunk) {
          chunks.push(chunk);
        });
        file.on('error', function(err) {
          fileError = true;
        });
      }
    });

    busboy.on('finish', function() {
      if (!fileError && chunks.length>0) {
        fs.writeFile(path.resolve(savePath), Buffer.concat(chunks), function (err) {
          if (err) throw err;
          res.json({'location':savePath});
        });
      } else {
        res.send('Failed to save image');
      }
    });

    req.pipe(busboy);
  });

return app;
};
