var find = require('dom-select');
var Mustache = require('mustache');
var fs = require('fs');
var shapeAttributeEditorTemplate = fs.readFileSync(__dirname + '/index.hbs', 'utf8');

module.exports = {
  init: function(AppState) {

    // DOM elements for User Management
    this.container = find('#shapeEditor');//find('.cd-tabs-content li[data-content=Users]');

    // Curry AppState to the onFormChange method
    this.onFormChange = this.onFormChange(AppState);

    // Return ShapeAttributeEditor
    AppState.ShapeAttributeEditor = this;
  },
  // Needs to be called by Tools and when User selects a shape in
  // Canvas
  editShapeAttributes: function(shape) {
    console.log('Update Shape', shape);

    //console.log(shapeAttributeEditorTemplate);
    this.container.innerHTML = Mustache.render(shapeAttributeEditorTemplate, shape);
  },

  clearShapeEditor: function() {
    this.container.innerHTML = "";
  },

  onFormChange: function(AppState) {
      return function(e) {
        console.log('Change', e);
        // Get target that has changed;
        var propertyBox = e.target;

        if(propertyBox.localName === 'input' && propertyBox.value) {
          //console.log(propertyBox.value);
          console.dir(propertyBox);

          if(propertyBox.attributes && propertyBox.attributes[1].localName === 'shapeattr') {
            var prop = propertyBox.attributes[1].value;
            shape[prop] = propertyBox.value;
          }
        }
      }.bind(this);
  },

  addUserInteraction: function() {
    // Attach onChange event on container element
    this.container.addEventListener('change', this.onFormChange, false);
  },

  removeUserInteraction: function() {
    // Remove onChange event on container element
    this.container.removeEventListener('change', this.onFormChange, false);
  }

}
