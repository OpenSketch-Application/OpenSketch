# OpenSketch

An online whiteboard application used for ideation and remote collaboration. This project is developed for Seneca@York's PRJ566 and PRJ666 course.

This project is built using [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) and [Socket.io](https://github.com/Automattic/socket.io).

## Usage

Ensure that the following dependencies are installed: 

Node.js and Grunt CLI

```bash
$ npm install # Root folder

$ cd Server
$ npm install 
$ grunt  # Server Folder
```

MongoDB:

Installing and Setting up Mongod database:

 1) Install MongoDb on your machine, see http://www.mongodb.org/downloads

 2) Add the bin folder to System path, ie. if u installed Mongodb in C:/Programs/MongoDb, the bin folder is in   C:/Programs/MongoDb/bin

 Windows/Window's Git console: edit the .bash_profile and add /c:/Programs/MongoDb/bin to the PATH variable

 3) Inside the server folder in the OpenSketch folder, run 
 ```bash
 $npm start
 ```
 Note: Make sure 2 directories (mongoBinaries and logs) are present in the server directory
 
 Note: if you are running on windows, just run "npm run startWin" in a new git console (windows cannot run background instances the same way unix/linux can and setting up a service requires more work then is worth it)

 4) To stop MongoDb, run 
 ```bash
 $npm stop
 ```
 
Project Structure
====================

```bash
  project
    │
    ├── Gruntfile.js 
    ├── LICENSE
    ├── README.md
    ├── app
    │   ├── css
    │   ├── images
    │   ├── js
    │   └── index.html
    │
    ├── node_modules
    ├── package.json
    ├── server
    │   ├── Gruntfile.js
    │   ├── package.json
    │   ├── routes
    │   ├── server.js
    │   └── socketHandlers
    │ 
    └── src
        ├── app.js
        ├── assets
        ├── less
        ├── model
        ├── tests
        └── views
```

## Gruntfile.js

A gruntfile is used to define a veriety of tasks that will be used by Grunt to build the application. Tasks can vary from running unit tests to compiling less files to deploying the application to a server.

## package.json

The package.json is a very important file that defines many key components utilized by the application. It also provides other useful information such as name and version number. The most read part of the package.json is perhaps the dependencies. The dependencies outlines what modules are utilized by this application and provides instructions on how npm should install these dependencies (ie. specific or latest version). When you do a npm install, package.json will be reviewed, and all dependencies will be installed in a folder called node_modules. To simply install a node module, do "npm install <module name>". To save it into the package.json as a dependency, use the --save option or --save-dev option to save it in the devDependencies. devDependencies are modules that are only utilized by developers to aid in developing the application. These dependencies should not be installed in the production copy. To ignore devDependencies when installing, do "npm install --production".

## node_modules

This folder contains all the node_modules you have installed for use with the application. Doing "npm install" will create the folder if it doesn't exist, and install all dependencies (regular, dev, and peer).


## app

The app folder will contain all the static web elements of the application. It is also the root folder of your local web server. There should be no need to edit any css or javascript files here. In short, all css and js files will be released here through various processes such as less processing or js browserification.

## server

The server folder contains the server component of our application. It will contain all the necessary logic to deliver the application and contains files such as routes and socketHandlers.

## src

The src folder contains all the main application logic. This is where the majority of our js files will reside. The js files in this folder will be concatonated by Grunt and outputed into the app/js folder (or less to css in the app/css folder).

## src/assets

The assets folder contains all the binary files that will be utilized in the application. This includes any images, audio, video, or font files.

## src/views

The views folder will contain handlebar templates that will be utilized to insert html snippets into the various html pages.


Modules and Libraries Used
============================

## Pixi.js

Pixi.js is a lightweight 2D webGL renderer that has HTML5 canvas fallback. This library will be used to create the graphics on the whiteboard.

## Socket.io

The Socket.io library is used to develop real time applications by utilizing Web Sockets underneath with Polling fallback. In this application, sockets will be used to transfer drawing and chat information between users. In addition, socket.io provides the means to separate users into rooms and namespaces.

## Express

Express is a Node.js web application framework and will be used to create the server component of the application. Express is a minimalistic framework and makes it easy to compliment other developmental frameworks and libraries.

## Mongoose

Mongoose is a library that provides MongoDB object mapping. This means that objects/data in our document database will be mapped, using Mongoose, to JavaScript objects for use in our application.

## Browserify

Browserify is a tool that allows us to use the 'require' method on the browser. The 'require' method is Node.js primary method of importing modules for use and is not normally available on the browser. Through the browserification process, another version of the 'require' method will be used on the client.

## Less

Less is a preprocessor for writing CSS with extended logics and complexity and enables the use of variables. Basically, we write css using less syntax (which is very similar to css) and the preprocessor will compile it into css. Using less encourages writing cleaner, less repetitive css code and makes it easier to read the styles.


Development Tools Used
========================

## Tape

Tape is a minimalistic JavaScript library used to create test cases for applications.

## Grunt

Grunt is a task automation tool that allows us automate the building process. For example, if we want to compile our less files into css before running our server to test changes made, our Gruntfile (the concept is based on makefile) will specify these actions to take. This means, with a simple command, a number of tasks will be executed without us having to run each one manually, everytime.

