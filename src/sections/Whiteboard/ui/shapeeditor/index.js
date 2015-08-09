var find = require('dom-select');
var Mustache = require('mustache');
var fs = require('fs');
var shapeAttributeEditorTemplate = fs.readFileSync(__dirname + '/index.hbs', 'utf8');
var EVENT = require('../../../../model/model').socketEvents;

module.exports = {
  init: function(AppState) {

    // DOM elements for User Management
    this.container = find('#shapeEditor');

    // Curry AppState to the onFormChange method
    this.onFormChange = this.onFormChange(AppState);

    // Return ShapeAttributeEditor
    AppState.ShapeAttributeEditor = this;

    this.userInteractionAdded = false;
    this.shapeEditorSelected = false;
    this.globalKeyDown = AppState.GlobalEvents['keydown'];

    this.container.addEventListener('focus', this.onFocusClick.bind(this), false);
    this.container.addEventListener('blur', this.onBlurClick.bind(this), false);
  },
  onFocusClick: function(e) {
    var propertyBox = e.target;
    //console.log('mouseclicked', e, propertyBox);
    console.log('propertyBox', propertyBox.localName);
    document.removeEventListener('keydown', this.globalKeyDown);

    // if(propertyBox && propertyBox.localName === 'input') {
    this.shapeEditorSelected = true;
    //   document.removeEventListener('keydown', this.globalKeyDown);
    // }
    // else {
    //   this.shapeEditorSelected = false;
    //   document.addEventListener('keydown', this.globalKeyDown);
    // }
  },
  onBlurClick: function(e) {
    this.shapeEditorSelected = false;
  },
  // Needs to be called by Tools and when User selects a shape in
  // Canvas
  editShapeAttributes: function(shape, toolbarShape) {
    console.log('Update Shape', shape);
    var shapeModel;
    if(toolbarShape) {
      shapeModel = shape || {};
      shapeModel.shapeType = toolbarShape + ' Tool';
      this.currentToolbarShape = shapeModel;
    }
    else {
      shapeModel = shape.getProperties();
      shapeModel.x = shape.graphics.x || shape.x;
      shapeModel.y = shape.graphics.y || shape.y;
      this.currentToolbarShape = null;
    }

    this.container.innerHTML = Mustache.render(shapeAttributeEditorTemplate, shapeModel);
    if(!this.userInteractionAdded) this.addUserInteraction();
  },

  clearShapeEditor: function() {
    this.container.innerHTML = "";
    this.removeUserInteraction();
    this.currentToolbarShape = null;
  },

  onFormChange: function(AppState) {
      return function(e) {
        var shape = AppState.Tools.select.selectedObject;
        var socket = AppState.Socket;
        console.log('Change', e);
        // Get target that has changed;
        var propertyBox = e.target;
        // Check if there is a selected Shape, otherwise it will be a tool
        if(shape) {
          if(propertyBox && propertyBox.localName === 'input' && propertyBox.value) {
            //console.log(propertyBox.value);
            console.dir(propertyBox);

            if(propertyBox.attributes && propertyBox.attributes[1].localName === 'shapeattr') {
              var prop = propertyBox.attributes[1].value;

              if(shape && shape[prop]){
                if(propertyBox.type === 'number'){
                  shape[prop] = Number.parseFloat(propertyBox.value);
                  shape.draw({});
                }
                else {
                  shape[prop] = propertyBox.value;
                  shape.draw({});
                }
              }

              shape.setMoveListeners(AppState);

              socket.emit(EVENT.shapeEvent, 'modify', AppState.Tools.select.selectedObject.getProperties());

              socket.emit(EVENT.updateObject, AppState.Tools.select.selectedObject.getProperties());

              shape.highlight();

            }
          }
        }
        else if(this.currentToolbarShape) {
          // A toolbar shape had been selected, change the default properties to affect all other
          // shapes that will be created
          // AppState.Tools
        }
      }.bind(this);
  },

  addUserInteraction: function() {
    // Attach onChange event on container element
    this.container.addEventListener('change', this.onFormChange, false);
    this.userInteractionAdded = true;
  },

  removeUserInteraction: function() {
    // Remove onChange event on container element
    this.container.removeEventListener('change', this.onFormChange, false);
    this.userInteractionAdded = false;
    this.currentToolbarShape = null;
  }

}
