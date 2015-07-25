var EVENT = require('../../../../model/model').socketEvents;;
var Cookies = require('cookies-js');
var Mustache = require('mustache');
var find = require('dom-select');
var fs = require('fs');
var userManagementTemplate = fs.readFileSync(__dirname + '/userManagement.hbs', 'utf8');
//fs.readFileSync(__dirname + '/index.hbs', 'utf8');
module.exports = {
  init: function(AppState) {
    console.log('Initing User Manager');
    console.log(find('.cd-tabs-content li[data-content=Users]'));
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

  },
  addUser: function(user) {
    Mustache.render(userManagementTemplate, [user]);
  },
  updateUsers: function(users) {
    console.log(users);
    //this.container.removeEventListener('click', this.onMouseClick);

    //this.container.addEventListener('click', this.onMouseClick.bind(this), false);

    // users should be in an Array
    this.container.innerHTML = Mustache.render(userManagementTemplate, users);

    //Mustache.render(userManagementTemplate, AppState.Users);

  },
  onMouseClick: function(e) {
    console.log('clicking ', this);
    var target = e.target;
    var clickedOnUser;
    var userId;

    e.stopPropagation()

    //console.log(e);
    console.log('clicked user permission', e);
    if(target.className.match('chatToggle')) {

      // Get the parent li, which has the User's Id
      // path is li div div.chatToggle
      userId = e.target.parentNode.parentNode.id;
      clickedOnUser = this.Users.getUserById(userId);

      if(clickedOnUser.permissions.canChat) {
        clickedOnUser.permissions.canChat = false;

        // Basically removing onSet class, by only keeping canChat class on className
        target.className = 'chatToggle';
      }
      else {
        clickedOnUser.permissions.canChat = true;
        target.className = 'chatToggle canChat';
      }

      this.emitSocketUserPermissionsChanged(clickedOnUser);
    }
    else if(target.className.match('drawToggle')) {
      // Get the parent li, which has the User's Id
      // path is li div div.chatToggle

      userId = e.target.parentNode.parentNode.id;
      clickedOnUser = this.Users.getUserById(userId);

      if(clickedOnUser.permissions.canDraw) {
        clickedOnUser.permissions.canDraw = false;

        // Basically removing onSet class, by only keeping canChat class on className
        target.className = 'drawToggle';
      }
      else {
        clickedOnUser.permissions.canDraw = true;
        target.className = 'drawToggle canDraw';
      }

      this.emitSocketUserPermissionsChanged(clickedOnUser);
    }
    else if(target.className.match('removeUser')) {
      userId = e.target.parentNode.parentNode.id;
      clickedOnUser = this.Users.getUserById(userId);

      console.log('Remove this User', clickedOnUser);
    }
  },
  setSocketEvents: function(AppState) {
    // Attach Socket to User Management Class
    var socket = this.socket = AppState.Socket;


    socket.on(EVENT.updateUserList, function(msg, users, curUserIndex) {
      console.log('in update user list', users, curUserIndex);

      AppState.Users.users = users;

      this.container.innerHTML = Mustache.render(userManagementTemplate, AppState.Users);

      if(curUserIndex !== undefined){
        console.log('Current user set to: ' + users[curUserIndex]);

        AppState.Users.currentUser = users[curUserIndex];
      }

      // First check if User is head user
      // We can do this by seeing if the first User in Array matches this user's
      // id, else dont set any listeners on User Management
      if(!this.mouseEventAttached && AppState.Users.currentUser.userRank === 0){
        this.container.addEventListener('click', this.onMouseClick, false);
        this.mouseEventAttached = true;
      }


    }.bind(this));

    socket.on(EVENT.userLeft, function(removedUser) {
      console.log('USER LEFT registered', removedUser);
    })

    socket.on(EVENT.permissionChanged, function(userModel) {
      console.log('Premission changed', userModel);
      var user = AppState.Users.getUserById(userModel._id);
      if(user)
        AppState.Users.users[user.userRank] = userModel;//.getUserById(userModel._id);
      else
        console.error('Unable to find User', userModel);
      // Remove listeners on other components to prevent user from
      // interacting with parts of the application he has no permission
      // for

      // Remove ChatBox listeners
      if(AppState.ChatBox && userModel.permissions.canChat === false) {
        AppState.ChatBox.removeUserInteraction(); //
      }

      // Remove Canvas/Stage and Toolbar Listeners

      this.updateUsers(AppState.Users);

    }.bind(this));
  },
  emitSocketUserPermissionsChanged: function(userModel) {
    this.socket.emit(EVENT.permissionChanged, userModel);
  },
  destroy: function() {
    this.container.removeEventListener('click', this.onMouseClick.bind(this), false);
  }
}
