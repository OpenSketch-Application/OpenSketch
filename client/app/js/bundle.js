(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var PIXI = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var io = (typeof window !== "undefined" ? window.io : typeof global !== "undefined" ? global.io : null);

(function() {
  window.onload = function() {
    console.log('loaded');
    var canvas = document.getElementById('whiteboard-container');
    var renderer = new PIXI.WebGLRenderer(1200, 900);
    canvas.appendChild(renderer.view);

    var stage = new PIXI.Container();

    //var socket = io.connect('http://localhost');
    var socket = io();

    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

  };

})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
