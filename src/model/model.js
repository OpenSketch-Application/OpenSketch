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

    // Session Creation/Validation Events
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
    'removeShape' : 'removeShape'

    //'sendPencil' : 'sendPencil'
    // 'sendLine' : 'sendLine'
  }
};
