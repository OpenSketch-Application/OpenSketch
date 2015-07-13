var PIXI = require('pixi');
var importFileToPixi = require('./shapeHelpers/importFileToPixi');

module.exports = function(el, AppState) {
  var fileSelect = document.getElementById('imgImport');

  el.addEventListener('click', function(data) {
    // console.log('Selected Import...', fileSelect);

    selectPressed = true;

    // // Fire event on the hidden file input field
    fileSelect.click();
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



