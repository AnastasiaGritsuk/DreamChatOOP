var AppState = require('./app-state');
var DocumentView = require('./documentView');
var Client = require('./client');
var App = require('./app');

var client = new Client();
var model = new AppState();
var view = new DocumentView();
var app = new App(client, view, model);
