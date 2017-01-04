var appStateModel = require('./appState');
var Emitter = require('component-emitter');
var emitter = new Emitter;

emitter.on('sendButtonClick', onSendButtonClick);
emitter.on('editCompleteClick', onEditComplete);
emitter.on('deleteClick', onDeleteClick);


newMessageBox.addEventListener('keypress', function(evtObj){
    //showTypeheads();

    if(iskeyCode13(evtObj)){
        console.log(evtObj);
        onSendButtonClick(evtObj.target.nextElementSibling,true);
        evtObj.preventDefault();
    }
    return false;
});

function iskeyCode13(evtObj) {
    return evtObj.keyCode == 13;
}

function ajax(method, url, data, continueWith, continueWithError, defaultErrorHandler){
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

var theMessage = function(text){
    return {
        id: appStateModel.uniqueId(),
        text:text,
        user: appStateModel.appState.user
    }
}

function syncHistory(appState,newMsg, callback){
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

function onSendButtonClick(fn){
    fn();
    var newMessage = theMessage(newMessageBox.value);
    if(newMessageBox.value == '')
        return;

    newMessageBox.value = '';

    ajax('POST', appStateModel.appState.mainUrl, JSON.stringify(newMessage), function(){
        element.removeAttribute('disabled');
    });
}

function onEditComplete(evtObj){
    var current = evtObj.target.shadowRoot.children[1];
    var input = current.getElementsByClassName('msg-editedText')[0];

    var updatedMessage = {
        id: current.id,
        text: input.value,
        user: appStateModel.appState.user
    }

    ajax('PUT', appStateModel.appState.mainUrl, JSON.stringify(updatedMessage), function(){
        sendButton.removeAttribute('disabled');
    });
}

function onDeleteClick(evtObj){
    sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target;

    ajax('DELETE', appStateModel.appState.mainUrl + '/'  + 'delete(' + current.id + ')', null, function(){
        sendButton.removeAttribute('disabled');
    });
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

function loadUser(){
    var user = appStateModel.appState.user;
    appStateModel.appState.user = user;
    username.innerHTML = appStateModel.appState.user;
}

module.exports = {
    ajax:ajax,
    loadUser:loadUser,
    syncHistory:syncHistory,
    onSendButtonClick:onSendButtonClick,
    onEditClick:onEditClick,
    onEditComplete:onEditComplete,
    onEditCancelClick:onEditCancelClick,
    onEditUsernameClick:onEditUsernameClick,
    onEditCompleteUsernameClick:onEditCompleteUsernameClick,
    onDeleteClick:onDeleteClick
};
