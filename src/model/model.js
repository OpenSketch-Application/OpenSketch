var model  = {
  '/home': {
    'template': 'template file'
  },
  '/whiteboard': {
    'template': 'template file'
  },
  'socketEvents':{
    // Announcements/Messages
    'chatMessage': 'chatMessage',
    'announcement': 'announcement',

    // User Joining/Leaving Events
    'updateUserList': 'updateUserList',
    'updateChatList': 'updateChatList',
    'userLeft': 'userLeft',
    'UserList':'UserList',

    // User Permissions
    'permissionChanged': 'permissionChanged',
    'removeUser':'removeUser',
    'removeThisUser':'removeThisUser',
    'disconnectUser': 'disconnectUser',
    'usersChanged': 'usersChanged',

    //'addUser':'addUser' // just show email pop and email the user the session url

    // Session Creation/Validation Events
    'saveSettings': 'saveSettings',
    'loadSettings': 'loadSettings',
    'getSocketID': 'getSocketID',
    'joinSession': 'joinSession',
    'validateSession': 'validateSession',
    'createSession': 'createSession',
    'badSession': 'badSession',
    'deleteSession': 'deleteSession',
    'saveSession' :'saveSession',

    // Pixi/Canvas Draw Events
    'shapeEvent':'shapeEvent',
    'populateCanvas' : 'populateCanvas',

    'saveObject' : 'saveObject',
    'updateObject' : 'updateObject',
    'deleteObject' : 'deleteObject',
    'clearShapes' : 'clearShapes',
    'removeShape' : 'removeShape',
    'imageUpload' : 'imageUpload',

    //'sendPencil' : 'sendPencil'
    // 'sendLine' : 'sendLine'
  }
};

// model.API_URL = window.location.origin

module.exports = model;
