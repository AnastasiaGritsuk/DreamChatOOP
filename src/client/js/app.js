var AppState = require('./app-state');
var DocumentView = require('./documentView');
var Client = require('./client');

var model = new AppState();
var view = new DocumentView();
var client = new Client();

view.on('ready', run);
view.on('sendButtonClick', onSendButton);
view.on('editCompleteClick', onEditComplete);
view.on('deleteClick', onDelete);
view.on('editClick', onEdit);
view.on('editCancelClick', onEditCancel);
view.on('editUsernameClick', onEditUsername);
view.on('editCompleteUsernameClick', onEditCompleteUsername);

function run(){
    view.loadUser(model);
    view.newMessageBox.addEventListener('keypress', function(e){
        showTypeheads();
        if(e.keyCode == 13){
            onSendButton(true);
            e.preventDefault();
        }
        return false;
    });

    doPolling(function(chunk){
        model.token = chunk.token;
        model.syncHistory(chunk.messages, function(needToRender){
            if(needToRender)
                view.render(model);
        });
    });
}

function onSendButton(enterkey){
    if(view.sendButton.getAttribute('disabled') && enterkey)
        return false;

    view.changeSendBtnState('disabled');
    var newMessage = model.theMessage(view.getNewMessage());
    if(view.getNewMessage() == '')
        return;

    view.newMessageBox.value = '';
    client.postMessage(model.mainUrl, newMessage, function () {
        view.changeSendBtnState('enabled');
    });
}

function onEdit(evtObj){
    view.changeSendBtnState('enabled');
    view.setState(evtObj, 'edit');
}

function onEditComplete(evtObj){
    var current = view.getCurrentMsgContainer(evtObj);
    var input = current.getElementsByClassName('msg-editedText')[0];

    var updatedMessage = {
        id: current.id,
        text: input.value,
        user: model.user
    };
    client.editMessage(model.mainUrl, updatedMessage, function () {
        view.changeSendBtnState('enabled');
    });
}

function onDelete(evtObj){
    view.changeSendBtnState('enabled');
    var current = view.getCurrentMsgContainer(evtObj);

    client.deleteMessage(model.mainUrl, current.id, function () {
        view.changeSendBtnState('enabled');
    });
}

function doPolling(callback){
    function loop(){
        client.getHistory(model.mainUrl, model.token, function (response) {
            var answer = JSON.parse(response);
            callback(answer);
            setTimeout(loop, 1000);
        });
    }
    loop();
}

function onEditCancel(evtObj){
    view.setState(evtObj, 'new');
}

window.onerror = function(err) {
   // output(err.toString());
};

function onEditUsername(evtObj){
    view.setUsernameState(evtObj, 'edit');
    view.inputUsername.focus();
}

function onEditCompleteUsername(evtObj){
    model.user = view.getUsername();
    view.loadUser(model);
    view.setUsernameState(evtObj, 'initial');
}

function changeServer(){}

function showTypeheads(){
   // $('.typeahead').typeahead();
}