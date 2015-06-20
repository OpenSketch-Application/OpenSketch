'use strict';
var foo = {}
// Object.defineProperties(foo, {
//     bar: {
//         value: null,
//         writable: true,
//         get: function() {
//           return this.bar;
//         },
//         set: function(value) {
//           this.bar = value
//         }
//     },
//     foo: {
//         value: function() {
//            console.log(this.bar);
//         }
//     },
// });
//@param {string} newType
  // Object.defineProperty(Product.prototype, "type", {
  //   //@return {string}
  //   get: function () {
  //       return this.prefix_ + ": " + this.type_;
  //   },
  //   // @param {string}
  //   set: function (newType) {
  //     this.type_ = newType;
  //   }
  // });
var _Canvas = {};

Object.defineProperties(_Canvas, {
  _stage: {
    value: null,
    writable: true
  },
  stage: {
    get: function() {
      return this._stage;
    },
    set: function(stage) {
      this._stage = stage;
    }
  },
  _renderer: {
    value: null,
    writable: true
  },
  renderer: {
    get: function() {
      return this._renderer;
    },
    set: function(renderer) {
      this._renderer = renderer;
    }
  },
  _maxUsers: {
    value: 0,
    writable: true
  },
  maxUsers: {
    get: function() {
      return this._maxUsers;
    },
    set: function(maxUsers) {
      this._maxUsers = maxUsers;
    }
  },
  _canDraw: {
    value: true,
    writable: true
  },
  canDraw: {
    get: function() {
      return this._canDraw;
    },
    set: function(canDraw) {
      this._canDraw = canDraw;
    }
  },
  _canChat: {
    value: true,
    writable: true
  },
  canChat: {
    get: function() {
      return this._canChat;
    },
    set: function(canChat) {
      this._canChat = canChat;
    }
  },
  Shapes: {
    value: [],
    writable: true
  }
});

var _Tools = {};

Object.defineProperties(_Tools, {
  _selected: {
    value: 'select',
    writable: true
  },
  selected: {
    get: function() {
      return this._selected;
    },
    set: function(selected) {
      this._selected = selected;
    }
  }
});

var AppState = {
  Canvas: _Canvas,
  Tools: _Tools,
  // Tools: {
  //   selected: '', // Currently selected tool
  //   // Every new tool will have these defaults settings
  //   // Can be changed by user for her preferences
  //   tools: {
  //     importer: {
  //       maxSize: 5
  //     },
  //     pencil: {
  //       fillColor: 0x000000,
  //       strokeWidth: 1
  //     },
  //     select: {
  //       selectedObject: null
  //     },
  //     line: {
  //       fillColor: 0x000000,
  //       strokeWidth: 1
  //     },
  //     rectangle: {
  //       fillColor: 0x000000,
  //       strokeColor: 0x000000,
  //       strokeWidth: 1,
  //       border:  {
  //         style: ['solid','dotted','dashed'],
  //         top: '',
  //         left: '',
  //         bottom: '',
  //         right: ''
  //       }
  //     },
  //     ellipse: {
  //       fillColor: 0xFFFFFF,
  //       strokeColor: 0x000000,
  //       strokeWidth: 1
  //     },
  //     templates: {

  //     },
  //     table: {

  //     }
  //   }
  // },
  Users: {
    currentUser: {
      canDraw: true,
      canChat: true
    },
    users: [] // index 0 is always for Head
  },
  Settings: {}, // General settings, ie. styles or themes
  Messages: [],
  Socket: null
};

module.exports = AppState;


