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
    
    //var infobox = find('#info-box');
    // states().idle.textbox.position[0] = 500;
    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ textbox1: find('#textbox1'), 
                                      textbox2: find('#textbox2'), 
                                      textbox3: find('#textbox3')
                                    })
                           .parsers(require('f1-dom'))
                           .init('init');

    this.animate.go('idle');
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
