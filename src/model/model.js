module.exports = {
  '/home': {
    'template': 'template file'
  },
  '/whiteboard': {
    'template': 'template file'
  },
  'socketEvents':{
    'sendDrawing': 'sendDrawing',
    'chatMessage': 'chatMessage',
    'joinSession': 'joinSession',
    'validateSession': 'validateSession',
    'updateUserList': 'updateUserList',
    'updateChatList': 'updateChatList',
    'updateCanvas': 'updateCanvas',
    'getSocketID': 'getSocketID',
    'createSession': 'createSession',
    'badSession': 'badSession',
    'announcement': 'announcement',

    // Pixi/Canvas Draw Events
    'objectModified':'objectModified',
    'objectAdded':'objectAdded',
    'objectDeleted': 'objectDeleted',

    'sendPencil' : 'sendPencil',

    'sendLine' : 'sendLine',
    
    'sendObject' : 'sendObject',
    'saveObject' : 'saveObject'
  }
};
