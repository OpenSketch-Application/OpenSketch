var test = require('tape');
var http = require('http');
var Promise = require('bluebird');

var testIdx = 0;

var routes = [ '/index.js',
               '/whiteboard.html'
             ];

var testRunner = function(url, tester) {
  var options = {
    host: 'localhost',
    path: url,
    port: '8080'
  };

  return new Promise(function(resolve, reject) {
    http.request(options, function(response){

      if(response) {
        tester.equal(response.statusCode, 200, routes[testIdx]);
        testIdx++;
        resolve();
      } else {
        reject('No response from server');
      }
    }).end();
  });
};


test('Testing routes', function(t) {

  t.plan(routes.length);

  server = require('../');
  testRunner('/index.html', t)
  .then(function() {
     return testRunner('/whiteboard.html', t);
  })
  .then(function() {
    server.destroy();
  });
});
