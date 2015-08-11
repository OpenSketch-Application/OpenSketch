var EVENT = require('../../../../model/model').socketEvents;;
var Cookies = require('cookies-js');
var Mustache = require('mustache');
var find = require('dom-select');
var fs = require('fs');
var framework = require('../../../../framework/index');
var userManagementTemplate = fs.readFileSync(__dirname + '/userManagement.hbs', 'utf8');

module.exports = {
  init: function(AppState) {
    // Attach template to App
    //this.userManagerContainer = find('');
    //this.userManagerContainer.innerHTML = Mustache.render(userManagementTemplate, AppState.Users);

    // DOM elements for User Management
    this.container = find('#userManagement');//find('.cd-tabs-content li[data-content=Users]');

    this.Users = AppState.Users;

    this.onMouseClick = this.onMouseClick.bind(this);

    // We want to make sure we attach mouse event once, which happens in
    // socket.on('updateUserList') and in socket.on('permissionChanged')
    this.mouseEventAttached = false;

    // We will always set socket event listeners
    this.setSocketEvents(AppState);

    AppState.UserManagement = this;

  },
  addUser: function(user) {
    Mustache.render(userManagementTemplate, [user]);
  },
  updateUsers: function(users) {
    //this.container.removeEventListener('click', this.onMouseClick);

    //this.container.addEventListener('click', this.onMouseClick.bind(this), false);
    // users should be in an Array
    this.container.innerHTML = Mustache.render(userManagementTemplate, users);

    //Mustache.render(userManagementTemplate, AppState.Users);
  },
  onMouseClick: function(e) {
    var target = e.target;
    var clickedOnUser;
    var userId;

    e.stopPropagation();
    e.preventDefault();
    console.log('UM Clicked', target);

    if(target.className.match('chatToggle')) {

      // Get the parent li, which has the User's Id
      // path is li div div.chatToggle
      userId = e.target.parentNode.parentNode.id;

      clickedOnUser = this.Users.getUserById(userId);

      if(clickedOnUser.userRank === 0) return false;

      if(clickedOnUser.permissions.canChat) {
        clickedOnUser.permissions.canChat = false;

        // Basically removing onSet class, by only keeping canChat class on className
        target.className = 'chatToggle img-circle';

        console.log('Chat disabled', target);
      }
      else {
        clickedOnUser.permissions.canChat = true;
        target.className = 'chatToggle canChat img-circle';

        console.log('Chat enabled', target);
      }

      this.emitSocketUserPermissionsChanged(clickedOnUser);
    }
    else if(target.className.match('drawToggle')) {
      // Get the parent li, which has the User's Id
      // path is li div div.chatToggle
      userId = e.target.parentNode.parentNode.id;

      clickedOnUser = this.Users.getUserById(userId);

      if(clickedOnUser.userRank === 0) return false;

      if(clickedOnUser.permissions.canDraw) {
        clickedOnUser.permissions.canDraw = false;

        // Basically removing onSet class, by only keeping canChat class on className
        target.className = 'drawToggle img-circle';
      }
      else {
        clickedOnUser.permissions.canDraw = true;

        target.className = 'drawToggle canDraw img-circle';
      }

      this.emitSocketUserPermissionsChanged(clickedOnUser);
    }
    else if(target.className.match('removeUser')) {
      userId = e.target.parentNode.parentNode.id;
      clickedOnUser = this.Users.getUserById(userId);

      // Might want to do special logic here since we might want Head User to just remove
      // himself from the session
      if(clickedOnUser.userRank === 0) return false;

      this.emitRemoveUser(clickedOnUser);
    }

    return false;
  },

  addUserInteraction: function() {
    // Add the mouse click listener that will handle enabling or disabling a
    // User permission, normally only Head user can have this functionality
    this.container.addEventListener('click', this.onMouseClick.bind(this), false);
    this.container.addEventListener('dragstart', this.dragStartHandler.bind(this), false);
    this.container.addEventListener('dragenter', this.dragEnterHandler.bind(this), false);
    this.container.addEventListener('dragover', this.dragOverHandler.bind(this), false);
    this.container.addEventListener('dragleave', this.dragLeaveHandler.bind(this), false);
    this.container.addEventListener('dragend', this.dragEndHandler.bind(this), false);
    this.container.addEventListener('drop', this.dropHandler.bind(this), false);
    // var list = find('#userManagement li');

    // Array.prototype.forEach.call(list, function(row) {
    //   row.addEventListener('drop', this.dropHandler.bind(this), false);
    // }.bind(this));
    this.mouseEventAttached = true;
  },
  dragStartHandler: function(e) {
    console.log(e);

    var userId;
    this.currentRow;
    console.log('Drag Start over ', e.target.id);

    //if(e.target.id && e.target.localName && e.target.localName === 'li') {
    userId = e.target.id;
    this.currentRow = e.target;
    console.log('userId:', userId);
    this.currentRow.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.currentRow.innerHTML);
    //}
  },
  dragEnterHandler: function(e) {
    if(this.currentRow && e.target.id !== this.currentRow.id && e.target.classList) {
      e.target.classList.add('over');
    }
  },
  dragOverHandler: function(e) {
    // if (e.preventDefault) {
    //   e.preventDefault(); // Necessary. Allows us to drop.
    //   //e.stopPropagation();
    // }
    if(e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    //  console.log('Dropping over ', e.target.id);
    }
    return false;
  },
  dragLeaveHandler: function (e) {
    // this / e.target is previous target element.
    if(e.target.id && e.target.classList) {
      e.target.classList.remove('over');
    }
  },
  dragEndHandler: function(e) {
    console.log('Drag End called', this);
    this.currentRow.style.opacity = '';

    var list = find('#userManagement li');
    e.target.classList.remove('over');
    // var tempData = e.target.innerHTML;
    // e.target.innerHTML = this.currentRow.innerHTML;
    // this.currentRow.innerHTML = tempData;
    this.currentRow = undefined;
  },
  dropHandler: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    console.log('Dropping content');

    if(this.currentRow !== e.target) {
      // Set the source rows's HTML to the HTML of the row we dropped on.
      this.currentRow.innerHTML = e.target.innerHTML;
      this.currentRow.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  },
  dragInteractionStopped: function(e) {
    console.log('Mouse Up fired');
    //if(this.currentRow) {
    this.currentRow = undefined;
    var list = find('#userManagement li');
    if(list) {
      Array.prototype.forEach.call(list, function(row) {
        row.classList.remove('over');
      });
    }
    //}
  },
  removeUserInteraction: function() {
    this.container.removeEventListener('click', this.onMouseClick, false);
    this.container.removeEventListener('dragstart', this.dragStartHandler, false);
    this.container.removeEventListener('dragenter', this.dragEnterHandler, false);
    this.container.removeEventListener('dragover', this.dragOverHandler, false);
    this.container.removeEventListener('dragleave', this.dragLeaveHandler, false);
    this.container.removeEventListener('dragend', this.dragEndHandler, false);
    //this.container.removeEventListener('drop', this.dropHandler, false);
    //this.container.removeEventListener('mouseup', this.dragInteractionStopped, false);
    this.mouseEventAttached = false;
  },
  setSocketEvents: function(AppState) {
    // Attach Socket to User Management Class
    var socket = this.socket = AppState.Socket;
    var stage = AppState.Canvas.stage;

    socket.on(EVENT.updateUserList, function(msg, users, curUserIndex) {
      console.log('Updating user list');

      AppState.Users.users = users;

      this.container.innerHTML = Mustache.render(userManagementTemplate, AppState.Users);

      if(curUserIndex !== undefined && users[curUserIndex]){
        AppState.Users.currentUser = users[curUserIndex];

        if(AppState.Users.currentUser._id) {
          Cookies.set(
            AppState.sessionId,
            AppState.Users.currentUser._id + ',' +
            AppState.Users.currentUser.username + ',' +
            AppState.Users.currentUser.userRank + ',',
            { expires: 800 }
          );
        }

        // Set up the User Interface, based on the User's permissions
        this.setUserInterface(AppState.Users.currentUser, AppState);
      }

    }.bind(this));

    socket.on(EVENT.userLeft, function(removedUser) {})

    socket.on(EVENT.permissionChanged, function(userModel) {
      console.log('Premission changed', userModel);
      var user = AppState.Users.getUserById(userModel._id);

      if(user)
        AppState.Users.users[user.userRank] = userModel;//.getUserById(userModel._id);
      else
        console.error('Unable to find User', userModel);

      // Set up the User Interface, based on the User's permissions
      this.setUserInterface(userModel, AppState);

      // Update the User List visible to the User
      this.updateUsers(AppState.Users);

    }.bind(this));

    socket.on(EVENT.disconnectUser, function(removeUserData) {
      var currentUserId = AppState.Users.currentUser._id;

      if(removeUserData._id === currentUserId && removeUserData.sessionId === AppState.sessionId) {
        Cookies.expire(removeUserData.sessionId);
        Cookies.set(removeUserData.sessionId, removeUserData.sessionId);
        socket.emit(EVENT.removeThisUser, AppState.Users.currentUser);
        framework.go('/home');
        location.reload();
      }
    });
  },

  setUserInterface: function(userModel, AppState) {
    // First check if User is head user
    // We can do this by seeing if the first User in Array matches this user's
    // id, else dont set any listeners on User Management
    // Note: Head user will have Rank 0, which also corresponds to array index
    if(!this.mouseEventAttached && AppState.Users.currentUser.userRank === 0) {

      // Sets the events listeners that handle user interaction
      this.addUserInteraction();
    }

    // Remove listeners on other components to prevent user from
    // interacting with parts of the application he has no permission
    // Remove ChatBox listeners
    if(userModel.permissions.canChat === false) {
      AppState.ChatBox.removeUserInteraction();
    }
    else {
      AppState.ChatBox.addUserInteraction();
    }

    // Remove Canvas/Stage and Toolbar Listeners
    if(userModel.permissions.canDraw === false) {
      AppState.ToolBar.removeUserInteraction();
    }
    else {
      AppState.ToolBar.addUserInteraction();
    }
  },
  emitSocketUserPermissionsChanged: function(userModel) {
    this.socket.emit(EVENT.permissionChanged, userModel);
  },
  emitRemoveUser: function(userModel) {
    this.socket.emit(EVENT.removeUser, userModel);
  },
  destroy: function() {
    this.container.removeEventListener('click', this.onMouseClick.bind(this), false);
  }
}
