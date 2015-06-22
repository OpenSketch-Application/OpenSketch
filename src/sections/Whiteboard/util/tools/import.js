var PIXI = require('pixi');
var importFileToPixi = require('./shapeHelpers/importFileToPixi');

module.exports = function(settings, el, AppState) {
  el.addEventListener('click', function(data) {
    console.log('Selected Import...');

    selectPressed = true;

    // Fire event on the hidden file input field
    fileSelect.click(settings, AppState);
  });

  console.log('importFileToPixi', importFileToPixi);
  // Attach event handler for loading images from toolbox
  var fileSelect = document.getElementById('imgImport');

  fileSelect.addEventListener('change', function(e) {
    console.log('file loaded');

    console.log(this.files);

    // Import the file into Canvas as a Sprite object
    importFileToPixi(this.files, settings, AppState);

  }, false);
};



