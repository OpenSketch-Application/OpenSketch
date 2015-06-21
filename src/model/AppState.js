module.exports = {
  Canvas: {
    stage: null,
    renderer: null,
    settings: {
      maxUsers: 0,
      canDraw: true,
      canChat: true
    },
    Shapes: {
    }
  },
  Tools: {
    selected: '', // Currently selected tool
    // Every new tool will have these defaults settings
    // Can be changed by user for her preferences
    tools: {
      importer: {
        maxSize: 5
      },
      pencil: {
        fillColor: 0x000000,
        strokeWidth: 1
      },
      select: {
        selectedObject: null
      },
      line: {
        fillColor: 0x000000,
        strokeWidth: 1
      },
      rectangle: {
        fillColor: 0x000000,
        strokeColor: 0x000000,
        strokeWidth: 1,
        border:  {
          style: ['solid','dotted','dashed'],
          top: '',
          left: '',
          bottom: '',
          right: ''
        }
      },
      ellipse: {
        fillColor: 0xFFFFFF,
        strokeColor: 0x000000,
        strokeWidth: 1
      },
      templates: {

      },
      table: {

      }
    }
  },
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
