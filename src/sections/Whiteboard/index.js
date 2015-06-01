var fs = require('fs');
var io = require('io');
var f1 = require('f1');
var find = require('dom-select');
var $ = require('jquery');
var PIXI = require('pixi');
var framework = require('../../framework/index');
var Model = require('../../model/model');
var states = require('./states');

module.exports = Section;

function Section() {}

Section.prototype = {

  init: function(req, done) {
    var body = find('body');
    var content = find('#content');
    this.section = document.createElement('div');
    this.section.innerHTML = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
    content.appendChild(this.section);

    createTabs();

    // find('#tabs').style.width = body.offsetWidth * 0.25 + 'px';

    states.init.whiteboard.position[0] = body.offsetWidth * 1.5;
    
    // Strap html to application
    var canvas = find('#whiteboard-container');
    console.log("width", canvas.style.width);
    var renderer = new PIXI.WebGLRenderer(body.offsetWidth * 0.75, body.offsetHeight - 60);
    canvas.appendChild(renderer.view);

    var stage = new PIXI.Container();

    var socket = io();

    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    this.animate = new f1().states(states)
                           .transitions(require('./transitions'))
                           .targets({ whiteboard: find('#whiteboard')})
                           .parsers(require('f1-dom'))
                           .init('init');

    done();
  },

  resize: function(w, h) {
  },

  animateIn: function(req, done) {
    this.animate.go('idle', function() {
      done();
    }.bind(this));
  },

  animateOut: function(req, done) {
    this.animate.go('out', function() {
      done();
    }.bind(this));
  },

  destroy: function(req, done) {
    console.log("Destroy!");
    this.section.parentNode.removeChild(this.section);
    done();
  }
};

function createTabs() {
  $(document).ready(function($){
    var toolItems = $('#flyout_menu li a');

    toolItems.on('click', function(event) {
      var selectedItem = $(this);

      if(!selectedItem.hasClass('menuSelected')) {
        toolItems.removeClass('menuSelected');
        selectedItem.addClass('menuSelected');
      }
      else {
        toolItems.removeClass('menuSelected');
      }
    });

    var tabItems = $('.cd-tabs-navigation a'),
    tabContentWrapper = $('.cd-tabs-content');

    tabItems.on('click', function(event){
      event.preventDefault();
      var selectedItem = $(this);
      if( !selectedItem.hasClass('selected') ) {
        var selectedTab = selectedItem.data('content'),
        selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
        slectedContentHeight = selectedContent.innerHeight();

        tabItems.removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');
        //animate tabContentWrapper height when content changes 
        tabContentWrapper.animate({
          'height': slectedContentHeight
        }, 200);
      }
    });

  //hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
  checkScrolling($('.cd-tabs nav'));
  $(window).on('resize', function(){
    checkScrolling($('.cd-tabs nav'));
    tabContentWrapper.css('height', 'auto');
  });
  $('.cd-tabs nav').on('scroll', function(){ 
    checkScrolling($(this));
  });

  function checkScrolling(tabs){
    var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
    tabsViewport = parseInt(tabs.width());
    if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.cd-tabs').addClass('is-ended');
    } else {
      tabs.parent('.cd-tabs').removeClass('is-ended');
    }
  }
});
}
