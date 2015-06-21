var PIXI = require('pixi');
var Canvas = {};

var animateId;

Canvas.init = function() {
  var _this = this;
  PIXI.dontSayHello = true;
  this.container = document.getElementById('whiteboard-container');
  this.renderer = new PIXI.CanvasRenderer(document.body.offsetWidth * 0.75,                                         document.body.offsetHeight - 60,                                         { antialias: true });
  this.container.appendChild(this.renderer.view);
  this.stage = new PIXI.Stage(0xFFFFFF, true);

  // FOR DEVELOPMENT
  window.STAGE = this.stage;
  //

  animate();

  function animate() {
    _this.renderer.render(_this.stage);
    animateId = requestAnimFrame(animate);
  }

  return this;
}

Canvas.destroy = function() {
  if(animateId) cancelAnimationFrame(animateId);
}

Object.defineProperties(Canvas, {
  maxUsers: {
    get: function() {
      return this._maxUsers;
    },
    set: function(maxUsers) {
      this._maxUsers = maxUsers;
    }
  },
  _canDraw: {
    value: true,
    writable: true
  },
  canDraw: {
    get: function() {
      return this._canDraw;
    },
    set: function(canDraw) {
      this._canDraw = canDraw;
    }
  },
  _canChat: {
    value: true,
    writable: true
  },
  canChat: {
    get: function() {
      return this._canChat;
    },
    set: function(canChat) {
      this._canChat = canChat;
    }
  }
});

module.exports = Canvas;
