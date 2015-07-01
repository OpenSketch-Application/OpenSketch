var PIXI = require('pixi');
var setMoveShapeListeners = require('./setMoveShapeListeners');

module.exports = function(files, settings, AppState, event) {
  var reader = new FileReader();
  reader.readAsDataURL(files[0]);

  console.log('dropped called');

  reader.onloadend = function() {
    //console.log(e);
    var imageSprite = new PIXI.Sprite.fromImage(reader.result);
    var xPos;
    var yPos;

    if(event) {
      xPos = event.x;
      yPos = event.y;
    }
    else {
      xPos = AppState.Canvas.renderer.width/2 - imageSprite.width/2;
      yPos = AppState.Canvas.renderer.height/2 - imageSprite.height/2;
    }

    imageSprite.x = xPos;
    imageSprite.y = yPos;
    imageSprite.interactive = true;

    AppState.Canvas.stage.addChild(imageSprite);

    AppState.Canvas.addNew('image', imageSprite);

    setMoveShapeListeners(imageSprite, settings, AppState);
  }
};

