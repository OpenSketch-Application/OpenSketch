var PIXI = require('pixi');
var importFileToPixi = require('./shapeHelpers/importFileToPixi');

module.exports = function(el, AppState) {
  var fileSelect = document.getElementById('imgImport');

  el.addEventListener('click', function(data) {
    // A flag that determines whether User should be able to interact with
    // this tool, as well as the Canvas Stage, usually set by Head user, through UserManagement
    if(!AppState.Settings.interactive) return false;

    selectPressed = true;
    AppState.Tools.selected = 'import';
    // // Fire event on the hidden file input field
    fileSelect.click();

    return false;
  });

  fileSelect.addEventListener('change', function(e) {
    console.log('file loaded');

    console.log(this.files);

    // Import the file into Canvas as a Sprite object
    importFileToPixi(this.files, AppState, e);

  });

  //console.log('importFileToPixi', importFileToPixi);
  // Attach event handler for loading images from toolbox
};



