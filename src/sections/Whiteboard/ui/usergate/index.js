var fs = require('fs');
var f1 = require('f1');
var find = require('dom-select');
var framework = require('../../../../framework/index');
var Model = require('../../../../model/model');
var states = require('./states');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    this.isNew = false;

    if(this.isNew) {
      var content = find('#content');
      this.section = document.createElement('div');
      this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
      content.appendChild(this.section);

      states.init.promptbox.position[1] = document.body.offsetHeight*1.5;

      this.animate = new f1().states(states)
                             .transitions(require('./transitions'))
                             .targets({ usergate: find('#usergate'), promptbox: find('#promptbox')})
                             .parsers(require('f1-dom'))
                             .init('init');
    }

    done();
  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    if(this.isNew) {
      this.animate.go('idle', function() {
        done();
      }.bind(this));
    } else {
      done();
    }
  },

  animateOut: function(req, done) {
    if(this.isNew) {
      this.animate.go('out', function() {
        done();
      }.bind(this));
    } else {
      done();
    }
  },

  destroy: function(req, done) {
    if(this.isNew)
      this.section.parentNode.removeChild(this.section);
    done();
  }
};
