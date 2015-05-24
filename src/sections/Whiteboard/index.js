var framework = require('../../framework/index');
var Model = require('../../model/model');
var PIXI = require('pixi');
var io = require('io');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    console.log('whiteboard loading');

    // Strap html to application
    var canvas = document.getElementById('whiteboard-container');
    var renderer = new PIXI.WebGLRenderer(1200, 900);
    canvas.appendChild(renderer.view);

    var stage = new PIXI.Container();

    var socket = io();

    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    done();
  },

  resize: function(w, h) {
    console.log('resize', 'width:', w, 'height:', h);
  },

  animateIn: function(req, done) {
    console.log('animateIn');
    done();

  },

  animateOut: function(req, done) {
    console.log('animateOut');
    done();

  },

  destroy: function(req, done) {
    console.log('destroy called');
    done();
  }
};
