var path = require('path');

module.exports = function(app,io,db) {
  var viewdir = path.resolve(__dirname + '/../');

  // GET
  app.get('/', function(req, res, next) {
    res.sendFile(viewdir +'/index.html');
  });

  //POST -- creating new session
  app.post('/session/:id',function(req,res,next){
    res.sendFile(viewdir + '/whiteboard.html');
  });
  //GET -- joining new session
  app.get('/session/:id',function(req,res,next){
     //if id param is in the db -- send to whiteboard view
     var attemptId = req.params.id;
     console.log(db);
     for(var i = 0; i < db.length; i++ ){// nice and linear db query
       if(db[i].id == attemptId){
          return res.sendFile(viewdir + '/whiteboard.html'); 
       }
     }

     res.redirect('/');
  }); 

  app.get('/js/vendor/:name' , function(req,res,next){
    res.sendFile(viewdir +'/js/vendor/'+req.params.name); 
  });
  app.get('/js/:name' , function(req,res,next){
    res.sendFile(viewdir +'/js/'+req.params.name); 
  });
  app.get('/css/:name' , function(req,res,next){
    res.sendFile(viewdir +'/css/'+req.params.name); 
  });


  
};
