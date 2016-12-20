var newMessageBox = document.getElementById('msgBox_textareaId');
var appStateModel = require('./appState');

newMessageBox.addEventListener('keypress', function(evtObj){
    //showTypeheads();

    if(iskeyCode13(evtObj)){
        onSendButtonClick(evtObj,true);
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

function onSendButtonClick(element,enterkey){
    if(element.getAttribute('disabled') && enterkey)
        return false;

    element.setAttribute('disabled', 'disabled');

    var newMessage = theMessage(newMessageBox.value);

    if(newMessageBox.value == '')
        return;

    newMessageBox.value = '';

    sendMessage(newMessage, function(){
        element.removeAttribute('disabled');
    });
}

function sendMessage(message, continueWith){
    var xhr = new XMLHttpRequest();

    ajax('POST', appStateModel.appState.mainUrl, JSON.stringify(message), function(response){
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

function onEditCancelClick(evtObj){
    evtObj.target.shadowRoot.children[1].dataset.state = "new";
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


module.exports = {
    ajax:ajax,
    syncHistory:syncHistory,
    onSendButtonClick:onSendButtonClick,
    onEditClick:onEditClick,
    onEditComplete:onEditComplete,
    onEditCancelClick:onEditCancelClick,
    onEditUsernameClick:onEditUsernameClick,
    onEditCompleteUsernameClick:onEditCompleteUsernameClick,
    onDeleteClick:onDeleteClick
};
