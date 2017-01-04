var appStateModel = require('./appState');
var appState = appStateModel.appState;
var client = require('./client');
var appViewRender = require('./render').render;
var emitter = require('./render').emitter;

emitter.on('DOMContentLoaded', run);

function run(){
    client.loadUser();
    doPolling(function(chunk){
        appState.token = chunk.token;
        client.syncHistory(appState,chunk.messages, function(needToRender){
            if(needToRender)
                appViewRender(appStateModel);    
        });
    });
}

function doPolling(callback){
    function loop(){
        client.ajax('GET', appState.mainUrl + '?token=' + appState.token, null, function(response){
            var answer = JSON.parse(response);
            callback(answer);

            setTimeout(loop, 1000);
        }, null, defaultErrorHandler);
    }
    loop();
}

window.onerror = function(err) {
   // output(err.toString());
};

function defaultErrorHandler(message){
    console.error(message);
}
//change server

function changeServer(){

}

function showTypeheads(){
   // $('.typeahead').typeahead();
}