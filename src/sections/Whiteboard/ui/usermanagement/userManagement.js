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

    // We will always set socket event listeners
    this.setSocketEvents(AppState);
  },
  addUser: function(user) {
    // user should be wrapped in an Array
    Mustache.render(userManagementTemplate, [user]);
  },
  onMouseClick: function(e) {
    console.log('clicking ', this);
    var target = e.target;
    var clickedOnUser;
    var userId;
    console.log(e);

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
    }

  },
  setSocketEvents: function(AppState) {
    var socket = AppState.Socket;
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
      //if(AppState.Users.currentUser._id === AppState.Users.users[0]._id) {
        // Attach DOM listeners
        this.container.addEventListener('click', this.onMouseClick.bind(this));
      //}

    }.bind(this));

    socket.on(EVENT.userLeft, function(removedUser) {
      console.log('USER LEFT registered', removedUser);

    })
  }

}
