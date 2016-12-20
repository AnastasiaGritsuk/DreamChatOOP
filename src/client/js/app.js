//var sendButton = document.getElementById('sendButton');

document.addEventListener('click', delegateEvent);

var inputUsername = document.getElementsByClassName('icon-input')[0];
var username = document.getElementById('username');
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
    loadUser();
    

    // sendButton.addEventListener('click', function() {
    //     client.onSendButtonClick();
    // });
    doPolling(function(chunk){
        appState.token = chunk.token;
        client.syncHistory(appState,chunk.messages, function(needToRender){
            if(needToRender)
                appViewRender(appStateModel);    
        });
    });
}

function loadUser(){
    var user = appState.user;
    appState.user = user;
    username.innerHTML = appState.user;
}

function doPolling(callback){
    function loop(){
        var xhr = new XMLHttpRequest();

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