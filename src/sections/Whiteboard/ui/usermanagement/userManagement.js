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
    // Remove previous listener
    this.container.removeEventListener('click', this.onMouseClick, false);

    // Add the mouse click listener that will handle enabling or disabling a
    // User permission, normally only Head user can have this functionality
    this.container.addEventListener('click', this.onMouseClick, false);

    this.mouseEventAttached = true;
    // Array.prototype.forEach.call(function(row) {
    //   row.addEventListener('dragstart', handleDragStart, false);
    //   row.addEventListener('dragenter', handleDragEnter, false);
    //   row.addEventListener('dragover', handleDragOver, false);
    //   row.addEventListener('dragleave', handleDragLeave, false);
    // });
  },

  removeUserInteraction: function() {
    this.container.removeEventListener('click', this.onMouseClick, false);
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

      if(curUserIndex !== undefined){
        AppState.Users.currentUser = users[curUserIndex];
        if(users[curUserIndex] && AppState.Users.currentUser._id) Cookies.set('UserId', AppState.Users.currentUser._id);
        if(users[curUserIndex] && AppState.Users.currentUser.username) Cookies.set('username', AppState.Users.currentUser.username);

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
      var currentUserId = Cookies.get('UserId');

      if(removeUserData._id === currentUserId && removeUserData.sessionId === AppState.sessionId) {
        Cookies.set(removeUserData.sessionId, removeUserData._id);
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
