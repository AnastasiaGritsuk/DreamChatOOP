var AppState = require('./app-state');
var DocumentView = require('./documentView');
var Client = require('./client');
var App = require('./app');
var User = require('./user');

function uniqueId () {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};

var user = new User('User' + uniqueId(), null);
var client = new Client();
var model = new AppState(user);
var view = new DocumentView();
var app = new App(client, view, model);
