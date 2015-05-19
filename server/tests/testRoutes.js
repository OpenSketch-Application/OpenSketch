var test = require('tape');
var http = require('http');
var promise = require('bluebird');

// Define routes to test here
var routes = [  '/index.html',
                '/whiteboard.html',
                '/RouteThatDoesntExist.html' // Should fail
             ];

var testRunner = function(url, tester) {
  var options = {
    host: 'localhost',
    path: url,
    port: '8080'
  };

  return new promise(function(resolve, reject) {
    http.request(options, function(response){
      if(response) {
        tester.equal(response.statusCode, 200, url);
        resolve();
      } else {
        reject('No response from server');
      }
    })
    .on('error', function(e) {
      reject('Connection refused');
    })
    .end();
  });
};

test('Testing routes', function(t) {

  t.plan(routes.length);

  server = require('../');
  
  promise.reduce(routes, function(prevRoute, curRoute, i, arrLength) {
    console.log(curRoute);
    return testRunner(curRoute, t)
           .catch(function (err) {
             t.fail(err);
           });
  }, 0).then(function() {
    server.destroy();
  });
});
