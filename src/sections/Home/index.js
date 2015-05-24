var framework = require('../../framework/index');
var Mustache = require('mustache');
var Model = require('../../model/model');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    console.log('home index.js loaded');

    // Strap html to application

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
