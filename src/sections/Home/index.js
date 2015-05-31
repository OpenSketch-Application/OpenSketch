var fs = require('fs');
var framework = require('../../framework/index');
var model = require('../../model/model');
var find = require('dom-select');
var f1 = require('f1');
var states = require('./states');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var content = find('#content');
    content.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ textbox1: find('#textbox1'), 
                                      textbox2: find('#textbox2'), 
                                      textbox3: find('#textbox3')
                                    })
                           .parsers(require('f1-dom'))
                           .init('init');

    this.animate.go('idle');

    // whiteboard options Section for user to create a whiteboard
    find('div.control:last-child button').addEventListener('click', function(e) {
      e.preventDefault();

      console.log('creating whiteboard');
      Whiteboard = getWhiteboardSettings();
    });

    done();
  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    // this.animate.go('idle', function() {
    //   done();
    // });
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
