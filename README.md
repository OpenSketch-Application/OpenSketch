# OpenSketch

An online whiteboard application used for remote collaboration and conferencing.

This project is built using [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) and [Socket.io](https://github.com/Automattic/socket.io).

## Usage

Ensure that the following dependencies are installed: 

Node.js and Grunt CLI

```bash
$ npm install
$ grunt
```bash

Modules and Libraries Used
============================

## Pixi.js

Pixi.js is a lightweight 2D webGL renderer that has HTML5 canvas fallback. This library will be used to create the graphics on the whiteboard.

## Socket.io

The Socket.io library is used to develop real time applications by utilizing Web Sockets underneath with Polling fallback. In this application, sockets will be used to transfer drawing and chat information between users. In addition, socket.io provides the means to separate users into rooms and namespaces.

## Express

Express is a Node.js web application framework and will be used to create the server component of the application. Express is a minimalistic framework and makes it easy to compliment other developmental software design patterns.

## Mongoose

Mongoose is a library that provides MongoDB object mapping. This means that objects/data in our document database will be mapped, using Mongoose, to JavaScript objects for use in our application.

## Browserify

Browserify is a tool that allows us to use the 'require' method on the browser. The 'require' method is Node.js primary method of importing modules for use and is not normally available on the browser. Through the browserification process, another version of the 'require' method will be used on the client.

## Less

Less is a preprocessor for writing CSS with extended logics and complexity and enables the use of variables. Basically, we write css using less syntax (which is very similar to css) and the preprocessor will compile it into css. Using less encourages writing cleaner, less repetitive css code and makes it easier to read the styles.


Development Tools Used
========================

## Tape

Tape is a minimalistic JavaScript library used to create test cases for application.

## Grunt

Grunt is a task automation tool that allows us automate the building process. For example, if we want to compile our less files into css before running our server to test changes made, our Gruntfile (a play on makefile) will specify these actions to take. This means, with a simple command, a number of tasks will be executed without us having to run each one manually, everytime.

