//var importFileToPixi = require('./tools/shapeHelpers/importFileToPixi');
var importFileToPixi = require('./tools/shapeHelpers/importFileToPixi');
module.exports = function(AppState) {
  var dropbox;

  dropbox = document.getElementById("whiteboard-container");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);

  function dragenter(e) {
    console.log('dragenter called');
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    console.log('dragover called');
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;

    console.log('import file to pixi', importFileToPixi);
    if(dt && dt.files) importFileToPixi(dt.files, AppState, e);
    else console.log('error unable to import image');
  }

};


