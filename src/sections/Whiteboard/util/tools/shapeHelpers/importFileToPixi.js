var PIXI = require('pixi');
var Import = require('../../shapes/Import');

module.exports = function(files, AppState, event) {
  var reader = new FileReader();
  console.log('files', files);
  reader.readAsDataURL(files[0]);
  var Tools = AppState.Tools;
  console.log('dropped called');
  var importedFile;
  var shapes = AppState.Canvas.Shapes;

  reader.onloadend = function() {

    importedFile = new Import(Tools.importer, reader.result);

    importedFile.graphics.x = Math.abs(AppState.Canvas.renderer.width/2 - importedFile.imageSprite.width/2);
    importedFile.graphics.y = Math.abs(AppState.Canvas.renderer.height/2 - importedFile.imageSprite.height/2);

    console.log('Adding Shape', importedFile);

    importedFile = shapes.addNew(importedFile);

    importedFile.setMoveListeners(AppState);

  }
};

