Small User List Demo Using Vanilla Js / HTML

To test - For me Personally, the document.cookie =""; line would only apply a cookie
in a mozilla Firefox environment. For testing, probably a good Idea t use that.

Basically this demo goes over the logic involved with retaining user information between sessions
this demo is focused on the logic of when to set a cookie, and when to check for a previous
cookie containing the users information. For the Node/Js Implementation, Instead of 
querying the userlist for a matching username, it will instead query the mongoDB database
Also, the user list population will be a draw on the whole collection instead. The cookies
set will also include only a user ID which will include all the meaningful data (room associated
Id, Username, and Admin status) Usernames will also be non unique, as the uniquity will come from 
the user Id

To Use:
To create an admin account, clear cookies and open a browser to Create.html
Create room will prompt a username input (Must Be unique at this stage). After entering, your name and status as an administrator
will be displayed.
Keep your cookie and navigate away from page, reload users.html, and your info will be auto updated to the page

To join as a User, delete cookie and navigate to users.html. (This Simulates when a user will join a 
room by recieving a link in some form)
It will prompt you for a name (Must Be unique at this stage) after entering you will be added to the list as a user.
