var test = require('tape');
var http = require('http');
var promise = require('bluebird');
var  server = require('../');

// Define routes to test here
var goodRoutes = [ '/index.html',
                    '/whiteboard.html',
                  ];

var badRoutes = [ '/DoesntExist.html',
                  '/index'
                ];

var testRunner = function(url, tester, expectedCode) {
  var options = {
    host: 'localhost',
    path: url,
    port: '8080'
  };

  return new promise(function(resolve, reject) {
    http.request(options, function(response){
      if(response) {
        tester.equal(response.statusCode, expectedCode, url);
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

test('Testing good routes - 200 Status Code', function(t) {

  t.plan(goodRoutes.length);
  
  promise.reduce(goodRoutes, function(initial, curRoute) {
    return testRunner(curRoute, t, 200)
           .catch(function (err) {
             t.fail(err);
           });
  }, 0);
});

test('Testing bad routes - 404 Status Code', function(t) {

  t.plan(badRoutes.length);

  promise.reduce(badRoutes, function(initial, curRoute) {
    return testRunner(curRoute, t, 404)
           .catch(function (err) {
             t.fail(err);
           });
  }, 0).then(function() {
    server.destroy();
  });
});