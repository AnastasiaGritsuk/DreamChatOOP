var sendButton = document.getElementById('sendButton');
var newMessageBox = document.getElementById('msgBox_textareaId');
document.addEventListener('click', delegateEvent);

var inputUsername = document.getElementsByClassName('icon-input')[0];
var username = document.getElementById('username');
document.addEventListener("DOMContentLoaded", run);

var appStateModel = require('./appState');
var appState = appStateModel.appState;

var appViewRender = require('./render');

var theMessage = function(text){
    return {
        id: appStateModel.uniqueId(),
        text:text,
        user: appState.user
    }
}


function delegateEvent(evtObj){
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon edit')) {
        onEditClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon cancel')) {
        onEditCancelClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon delete')) {
        onDeleteClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon complete')) {
        onEditComplete(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOn-username')) {
        onEditUsernameClick(evtObj);
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOff-username')) {
        onEditCompleteUsernameClick(evtObj);
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
            onSendButtonClick(true);
            e.preventDefault();
        }
        
        return false;
    });

    sendButton.addEventListener('click', onSendButtonClick);
    doPolling(function(chunk){
        appState.token = chunk.token;
        syncHistory(chunk.messages, function(needToRender){
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

function onSendButtonClick(enterkey){
    if(sendButton.getAttribute('disabled') && enterkey)
        return false;

    sendButton.setAttribute('disabled', 'disabled');

    var newMessage = theMessage(newMessageBox.value);

    if(newMessageBox.value == '')
        return;

    newMessageBox.value = '';

    sendMessage(newMessage, function(){
        sendButton.removeAttribute('disabled');
    });
}

function sendMessage(message, continueWith){
    var xhr = new XMLHttpRequest();

    ajax('POST', appState.mainUrl, JSON.stringify(message), function(response){
        continueWith();
    });
}

function onEditClick(evtObj){
    sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target.shadowRoot.children[1];
    current.dataset.state = "edit"; 

}

function onEditComplete(evtObj){
    var current = evtObj.target.shadowRoot.children[1];
    var input = current.getElementsByClassName('msg-editedText')[0];

    var updatedMessage = {
        id: current.id,
        text: input.value,
        user: appState.user 
    }

    ajax('PUT', appState.mainUrl, JSON.stringify(updatedMessage), function(){
        sendButton.removeAttribute('disabled');
    });
}

function onDeleteClick(evtObj){
    sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target;

    ajax('DELETE', appState.mainUrl + '/'  + 'delete(' + current.id + ')', null, function(){
       sendButton.removeAttribute('disabled');
    });
}

function doPolling(callback){
    function loop(){
        var xhr = new XMLHttpRequest();

        ajax('GET', appState.mainUrl + '?token=' + appState.token, null, function(response){
            var answer = JSON.parse(response);
            callback(answer);

            setTimeout(loop, 1000);
        });
    }

    loop();
}

function onEditCancelClick(evtObj){
    evtObj.target.shadowRoot.children[1].dataset.state = "new";
}

function syncHistory(newMsg, callback){
    if(newMsg.length === 0){
        callback();
        return;
    }

    var msgMap = appState.history.reduce(function(accumulator, msg){
        accumulator[msg.id] = msg;

        return accumulator;
    },{});

    for(var i=0;i<newMsg.length;i++){
        var id = newMsg[i].id;
        var item = msgMap[id];

        if(item == null){
            appState.history.push(newMsg[i]);
            continue;
        }

        item.text = newMsg[i].text;
        item.status = newMsg[i].status;
    }

    callback(true);
}









function ajax(method, url, data, continueWith, continueWithError){
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError || defaultErrorHandler;
    xhr.open(method || 'GET', url, true);

    xhr.onload = function(){
        if(xhr.readyState !==4)
            return;

        if(xhr.status !=200){
            continueWithError('Error on the server side, response ' + xhr.status);
            return;
        }

        if(isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            return;
        }

        continueWith(xhr.responseText);

    };

    xhr.ontimeout = function(){
        continueWithError('Server timed out !');
    };

    xhr.onerror = function (e) {
        var errMsg = 'Server connection error !\n'+
        '\n' +
        'Check if \n'+
        '- server is active\n'+
        '- server sends header "Access-Control-Allow-Origin:*"\n'+
        '- server sends header "Access-Control-Allow-Methods: PUT, DELETE, POST, GET, OPTIONS"\n';

        continueWithError(errMsg);
    };

    xhr.send(data);

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

function onEditUsernameClick(evtObj){
   evtObj.path[2].dataset.state = "edit";
   inputUsername.focus();
}

function onEditCompleteUsernameClick(evtObj){
    appState.user = inputUsername.value;
    loadUser();
    evtObj.path[2].dataset.state = "initial";
}

//change server

function changeServer(){

}

function showTypeheads(){
   // $('.typeahead').typeahead();
}