var PIXI = require('pixi');
var io = require('io');

(function() {
  window.onload = function() {
    console.log('loaded');
    var canvas = document.getElementById('whiteboard-container');
    var renderer = new PIXI.WebGLRenderer(500, 500);
    canvas.appendChild(renderer.view);

    var stage = new PIXI.Container();

    //var socket = io.connect('http://localhost');
    var socket = io();

    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  };
})();
