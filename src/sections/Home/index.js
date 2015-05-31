var fs = require('fs');
var framework = require('../../framework/index');
var model = require('../../model/model');
var find = require('dom-select');
var states = require('./states');
var f1 = require('f1');


module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var content = find('#content');
    var hbs = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    var infobox = find('#info-box');

    //states.init.textbox.position[1] = infobox.offsetWidth;

    // this.animate.go = new f1({

    // });

    content.innerHTML = hbs;
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
