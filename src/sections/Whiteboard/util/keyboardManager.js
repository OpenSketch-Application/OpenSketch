

module.exports = function(AppState) {
  var shapes = AppState.Canvas.Shapes;
  var socket = AppState.Socket;
  var users = AppState.Users;
  var Tools = AppState.Tools;

  // Set keyboard listeners
  document.addEventListener('keydown', KeyBoardManager.keyEventHandler.bind(this));

  var KeyBoardManager = {
    keyEventHandler: function(keyPress) {
      if(e.type === 'keypress') {
        // Return early for Invalid Key codes
        if (e.charCode < 32)
          return;
      }

      if(e.type === 'keydown') {
        switch(e.keyCode) {
          case 46: // DEL
            this.deleteEvent();
            break;

        }
      }
    },
    // Delete event
    deleteEvent: function() {
      if(this.Tools && this.Tools.selected === 'select' && this.Tools.select.selectedObject) {
        shapes
      }
    },
    // Copy Event?

    // Paste Event?

    // Crop Event?

    // Destroy
    destroy: function() {}
  };

  return KeyBoardManager;
};



