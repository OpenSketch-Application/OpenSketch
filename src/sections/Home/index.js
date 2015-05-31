var fs = require('fs');
var framework = require('../../framework/index');
var model = require('../../model/model');
var find = require('dom-select');
var states = require('./states');
var f1 = require('f1');

var Whiteboard;

module.exports = Section;
// module.exports = Whiteboard;
exports = Whiteboard;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var content = find('#content');
    var hbs = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    var infobox = find('#info-box');


    content.innerHTML = hbs;

    // whiteboard options Section for user to create a whiteboard
    find('div.control:last-child button').addEventListener('click', function(e) {
      e.preventDefault();

      console.log('creating whiteboard');
      Whiteboard = getWhiteboardSettings();
    });
    // Get all input elements

    //var whiteboardSettings =


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


function getWhiteboardSettings() {
  var inputElements = document.querySelectorAll('form input');

  return Array.prototype.slice
          .apply(inputElements)
            .reduce(function(settings, input) {
              settings[input.name] = input.value;
              return settings;
            }, {});
}
