//var mongoose = require('mongoose');
//var User = require('../server/db/DbManagers/UserManager');
//Includes from usergate index trying to grab cookie.
var fs = require('fs');
var f1 = require('f1');
//var find = require('dom-select');
var framework = require('../../src/framework/index');
var Model = require('../../src/model/model');
var EVENT = Model.socketEvents;



var Session = require('../../server/db/models/Session');
var User = require('../../server/db/models/User');
var Event = require('../../src/model/model');
var Cookies = require('cookies-js');



module.exports = {
	//Require Session Id, username, callback .
	//Assumes Validation and retrieval of ID from whatever call point 
	//Will need to add two permission arguments to replicate the desired changes 
	//Grab session cookie instead of passing it into the function. 
    setPerms: function(sessionId, session){
		console.log("Permission Change! " );
		console.log(sessionId);
		
		/*
		console.log("Session?: ");
		console.log(session);
		*/
		//For this example I used an incoming session id / session 
		//just need to grab the user cookie here to search for them to updateCommands
        Session.findById(sessionId, function(err, session){
			 //Find User from DB
			 if (err){
				console.log("Permissions Error");
				throw new Error('Permissions r bad');
			 }
			 else if(session._id){
				//These two logs were to check session validity if passed. 
				//Session here is good, now to grab the user. Alternatively, can alter this function 
				//to recieve the user Id. However to push to the user, needs chape Id, any clarifications?
				
				console.log("Session._id");
				console.log(session._id);
				//How to grab cookie? cookies.get is undefined 
				//When Requiring Dom select, document is also not defined
				//this.goozername = Cookies.get('username');
				//Then Grab the shape id ? is that supposed to be a userId ?
				//var thisUser = User.findone(goozername, shape id, function(err, result));
				//User.UpdateOne();
			 }
		});
        
        //User.findOne();
       
       
    }   
};