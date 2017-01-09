var AppState = require('./appState');
var Client = require('./client');
var DocumentView = require('./DocumentView');

var Emitter = require('component-emitter');
var emitter = new Emitter;

var appState = new AppState();
var documentView = new DocumentView();
var client = new Client();
var app = new App();

function App() {}

emitter.on('DOMContentLoaded', app.run);

App.prototype.run = run;
App.prototype.doPolling = doPolling;
App.prototype.defaultErrorHandler = defaultErrorHandler;
App.prototype.changeServer = changeServer;

function run(){
    client.loadUser();
    app.doPolling(function(chunk){
        appState.appState.token = chunk.token;
        client.syncHistory(appState.appState,chunk.messages, function(needToRender){
            if(needToRender)
                documentView.render(appState.appState);
        });
    });
}

function doPolling(callback){
    function loop(){
        client.ajax('GET', appState.appState.mainUrl + '?token=' + appState.appState.token, null, function(response){
            var answer = JSON.parse(response);
            callback(answer);

            setTimeout(loop, 1000);
        }, null, app.defaultErrorHandler);
    }
    loop();
}

function defaultErrorHandler(message){
    console.error(message);
}

function changeServer(){}

function showTypeheads(){
   // $('.typeahead').typeahead();
}

