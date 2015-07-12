module.exports = {
  init: function() {
    this.keyboardField = document.getElementById('keyboardField');
  },
  textInput: function(callback) {
    this.keyboardField = this.keyboardField || document.getElementById('keyboardField');

    keyboardField.innerText = "";

    this.keyboardField.oninput = function(e) {
      //e.stopPropagation();
      console.dir(keyboardField);
      callback(keyboardField.innerText);
    };

    keyboardField.focus();
  }
};
