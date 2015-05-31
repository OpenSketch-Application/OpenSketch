var fs = require('fs');
var framework = require('../../framework/index');
var Model = require('../../model/model');
var PIXI = require('pixi');
var io = require('io');

module.exports = Section;

function Section() {};

Section.prototype = {

  init: function(req, done) {
    var content = document.getElementById('content');
    var hbs = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.innerHTML = hbs;

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
  },

  animateIn: function(req, done) {
    done();
  },

  animateOut: function(req, done) {
    done();

  },

  destroy: function(req, done) {
    done();
  }
};
