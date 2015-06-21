//Gets to room somehow, checks for the cookies!
//call when the room is instantiated
//var cookiesMod = require('./cookiesMod');
//var nodeC = require('./cookiesNode');


function returningUser(){
	
	//cookiesMod.cookieValid("Cookies Mod Works!!");
	//Would use either of these two options to populate the list of//current users
	//var users = new Array();
	testPopulate();
	//alert("NodeTest");
	//alert(nodeC.x);
//basically checks if the cookie is starting as expected. Not otherway could
//a cookie get created, so will check for username.  	
	if(document.cookie.match(/^(.*;)?username=[^;]+(.*)?$/) === null){
		//user has not been in the room before, he assigned a cookie with is username
		alert("Not a Previous User");
		//Not been here before, is in the room through a link, well okay,
		createRegUser();
		addToList();
		//alert("Regular Cookie: "+document.cookie);
	}else{
		//user has a cookie set!
		//alright hes been here before. now to check if he was the admin previously!
		alert("Ive Been Here Before!");
		//After logic to check if it is an admin 
		//must include the logic to prompt current administrator about old administrator 
		//returning and overtaking role
		addToList();
		
		//First check to see if the room id matches
		//then take information from username get in order to re add his username
		/*
		if(checkCookie("admin")){
			//He is the admin. must deal with the logic of prompting the current admin
			//to relinquish admin control
			alert("And I am the Admin!");
			
		}else{
		// re add to list, give him the proper permissions 
			alert("And i am a regular user");
		}
		*/
		
		
	}
}
//Creating Users 
//Should probably dedicate these to an object, and then persist them so they can be 
//loaded when someone else enters the room
function createAdmin(){
	addUsername("");
	addAdmin("true");
	addId();
	//addToList();
	//Then add to users list
}
function createRegUser(){
	addUsername("");
	addAdmin("false");
	addId();
	//Then add to users list
	//addToList();
}





//CookieSetters must be added in the following order to allow for cookie parsing
//parsing to work
//AddsUsername Cookie
function addUsername(name){
	//Create dialogue box with previousname autofilled
		//alert("addingUsername!");
		var username = window.prompt("Insert Username", "My Name?");
		//Edit the check here to include if a username is unique or not
		var unique = isUnique(username);
		if(unique === "true"){
			alert("This Username is Unique!");
		}else{
			alert("This Username is Taken!");
		}
		
		if(username!=null && unique==="true"
			){
			//Append the room id here delimited By some specific character, to check if its the proper room
			//Regex out the room id and check if they match. (currently, room id will stay the same as long as session is there)
			document.cookie = "username="+username;
			
			alert("My new Username is: "+username);
			//Should then push to a persisted user list here / a mongo collection
		}else{
			addUsername(name);
		}
}

//Sets admin status based on how he joned the room
function addAdmin(status){
	//alert("setting admin value to:" + status);
	//need to get the generated room id and append to the end of admin here
	
	document.cookie = "admin="+status;
	
}

function addId(){
	//Here will need to somehow grab the sessions id, for now, random Id
	var value = "123456";
	//alert("adding room Id: "+value);
	document.cookie = "room="+value+"$";
}
//addregularuser




//PageFunctionality, tests, helper functions


//Front end adding to list.
//Must include a backend for a list of users with properties, so that someone can
//rejoin the session properly, and to be able to remove these list elements when they leave

//Adding a new user to list. 
//Need to populate a local array to load current users on click
//Grab this array for previous users that are in it.
//have to remove when a window is closed
function testPopulate(){
	alert("TestPopulation");
	//Get the user list
	var list = document.getElementById("uList");
	//get the username being used
	var username = "Liam";
	
	//Create the List item
	var entry = document.createElement('li');
	//Make the id the username, previously checked for if it is unique or not
	entry.setAttribute("id", username);
	//appending the user to the list
	entry.appendChild(document.createTextNode(username));
	list.appendChild(entry);
}

//Adds your username by referencing the cookie that is set
function addToList(){
	alert("Adding new User to List!");
	//Get the user list
	var list = document.getElementById("uList");
	//get the username being used
	var username = checkCookie("user");
	var role;
	if(checkCookie("admin") === "true"){
		role = "Administrator";
	}else{
		role = "User";
	}
	
	//Create the List item
	var entry = document.createElement('li');
	//Make the id the username, previously checked for if it is unique or not
	entry.setAttribute("id", username);
	//appending the user to the list
	entry.appendChild(document.createTextNode(username+", "+role));
	list.appendChild(entry);
	/*
	if(checkCookie("admin")=="true"){
		
	}
	*/
}
//Helper funtion t check user uList for a previous 
function isUnique(username){
	//REturns null if no element by this id is found. Must make sure that nobody uses 
	//common names for ids in the rest of the documet, or should only check for ids within
	//a certain class
	var check = document.getElementById(username);
	
	//the element returned false! a new user can be added 
	if(check === null){
		return "true";
	//found the element already! must reprompt for a new user	
	}else{
		return "false";
	}
}
//Fire this function when a user disconnects, will probably hav to accessed by another 
//function that is dealing with the sockets
//Check if it is an admin or a regular user
//Regular user will have to re-enter username and create new id7
//admin's cookie will last a designated amount of time so he can rejoin and retake head position

function removeFromList(){
	var entry = document.getElementById("");
}

//This function is called when a room is created. The 
function redirect(){
	//Basically the admin roll. He Started on the HomePage, created room 
	//and transitioned to the new page.
	//Must make a admin cookie with expirey after page closes.
	alert("New Room Created!");
	//
	createAdmin();
}


//activates on Try a thing button, testing splicing for now
function showCookie(){
	//Testing of the cookie splice
	//alert("show");
	var user = checkCookie("user");
	var status = checkCookie("admin");
	var room = checkCookie("room");
	alert("Username: "+user+" Is Admin?: "+status+" RoomId?: "+room);
}


//this function will take a number and return the value associated with it 
//ie, username is first value, if input a 0 to function, the username will be returned
function checkCookie(value){
	var result;
	var cookie = document.cookie;
	//To Return the username
	if(value==="user"){
		//End of Field Determination
		
		result = cookie.slice(9, nth_ocurrence(cookie, ";", 1));
		//alert("Username: " + result);
		
	}
	//To return ifis admin
	else if (value==="admin"){
		//edit this so it only gets the value of admin
		result = cookie.slice(nth_ocurrence(cookie, ";", 1) + 8, nth_ocurrence(cookie, ";", 2));
		//alert("Admin: " + result);
	}
	//To return the room Id associated with the cookie
	else if (value==="room"){
		result = cookie.slice(nth_ocurrence(cookie, ";", 2) + 7, nth_ocurrence(cookie, "$", 1));
		//alert("Room Id: " + result);
	}else{
		alert("Wrong Value son!");
	}
	
	return result;
}



//User http://stackoverflow.com/users/352672/nelson for find occurrences function
function nth_ocurrence(str, needle, nth) {
  for (i=0;i<str.length;i++) {
    if (str.charAt(i) == needle) {
        if (!--nth) {
           return i;    
        }
    }
  }
  return false;
}