var PIXI = require('pixi');
var Import = require('../../shapes/Import');

module.exports = function(files, AppState, event) {
  var reader = new FileReader();
  reader.readAsDataURL(files[0]);
  var Tools = AppState.Tools;
  console.log('dropped called');
  var importedFile;
  var shapes = AppState.Canvas.Shapes;

  reader.onloadend = function() {

    importedFile = new Import(Tools.importer, reader.result);


    if(event) {
      importedFile.graphics.x = event.x;
      importedFile.graphics.y = event.y
    }
    else {
      // Set the image to occupy the center of the Canvas
      importedFile.graphics.x = AppState.Canvas.renderer.width/2 - importedFile.imageSprite.width/2;
      importedFile.graphics.y = AppState.Canvas.renderer.height/2 - importedFile.imageSprite.height/2;
    }

    console.log('Adding Shape');

    shapes.addNew(importedFile);

    importedFile.setMoveListeners(AppState);

  }
};

