module.exports = {
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

    //'addUser':'addUser' // just show email pop and email the user the session url

    // Session Creation/Validation Events
    'getSocketID': 'getSocketID',
    'joinSession': 'joinSession',
    'validateSession': 'validateSession',
    'createSession': 'createSession',
    'badSession': 'badSession',
    'deleteSession': 'deleteSession',

    // Pixi/Canvas Draw Events
    'shapeEvent':'shapeEvent',
    'populateCanvas' : 'populateCanvas',

    'saveObject' : 'saveObject',
    'updateObject' : 'updateObject',
    'deleteObject' : 'deleteObject'

    //'sendPencil' : 'sendPencil'
    // 'sendLine' : 'sendLine'
  }
};
