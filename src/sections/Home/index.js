var fs = require('fs');
var f1 = require('f1');
var find = require('dom-select');
var framework = require('../../framework/index');
var model = require('../../model/model');
var states = require('./states');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var content = find('#content');
    var section = document.createElement('div');
    section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.appendChild(section);

    states.out.home.position[0] = -document.body.offsetWidth;

    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ textbox1: find('#textbox1'), 
                                      textbox2: find('#textbox2'), 
                                      textbox3: find('#textbox3'),
                                      home: find('#home')
                                    })
                           .parsers(require('f1-dom'))
                           .init('init');

    // whiteboard options Section for user to create a whiteboard
    find('div.control:last-child button').addEventListener('click', function(e) {
      e.preventDefault();

      console.log('creating whiteboard');
      Whiteboard = getWhiteboardSettings();
      this.animateOut();
      framework.go('/whiteboard');
    }.bind(this));

    done();
  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    this.animate.go('idle', function() {
      if(done)
        done();
    }.bind(this));
  },

  animateOut: function(req, done) {
    console.log('animate out');
    this.animate.go('out', function() {
      if(done)
        done();
    }.bind(this));
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
