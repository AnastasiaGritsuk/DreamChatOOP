var sendButton = document.getElementById('sendButton');
var newMessageBox = document.getElementById('msgBox_textareaId');
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
}

function isProperElement(e, classname){
    return e.path[1].className === classname;
}

function run(){
    loadUser();
    newMessageBox.addEventListener('keypress', function(e){

        showTypeheads();

        if(e.keyCode == 13){
            client.onSendButtonClick(true);
            e.preventDefault();
        }
        
        return false;
    });

    sendButton.addEventListener('click', function() {
        client.onSendButtonClick();
    });
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

f
function doPolling(callback){
    function loop(){
        var xhr = new XMLHttpRequest();

        client.ajax('GET', appState.mainUrl + '?token=' + appState.token, null, function(response){
            var answer = JSON.parse(response);
            callback(answer);

            setTimeout(loop, 1000);
        });
    }

    loop();
}




window.onerror = function(err) {
   // output(err.toString());
};


function defaultErrorHandler(message){
    console.error(message);
    // output(message);
}

function isError(text){
    if(text == "")
        return false;

    try{
        var obj = JSON.parse(text);
    }catch(ex){
        return true;
    }

    return !!obj.error;
}

//change server

function changeServer(){

}

function showTypeheads(){
   // $('.typeahead').typeahead();
}