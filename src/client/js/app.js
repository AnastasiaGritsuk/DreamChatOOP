document.addEventListener('click', delegateEvent);
document.addEventListener("DOMContentLoaded", run);

var appStateModel = require('./appState');
var appState = appStateModel.appState;

var appViewRender = require('./render');
var client = require('./client');

function delegateEvent(evtObj){
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon edit')) {
        client.onEditClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon cancel')) {
        client.onEditCancelClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon delete')) {
        client.onDeleteClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon complete')) {
        client.onEditComplete(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOn-username')) {
        client.onEditUsernameClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOff-username')) {
        client.onEditCompleteUsernameClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'btn sendButton')) {
        client.onSendButtonClick(evtObj.path[1], false);
        return;
    }
}

function isProperElement(e, classname){
    return e.path[1].className === classname;
}

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