var AppState = require('./app-state');
var DocumentView = require('./documentView');
var Client = require('./client');

var model = new AppState();
var view = new DocumentView();
var client = new Client();

view.on('ready', run);
view.on('sendMsg', sendMsg);
view.on('editMsgComplete', editMsgComplete);
view.on('deleteMsg', deleteMsg);
view.on('editMsgCancel', editMsgCancel);
view.on('editUsernameBegin', editUsernameBegin);
view.on('editUsernameComplete', editUsernameComplete);

function run(){
    view.loadUser(model);
    doPolling(function(chunk){
        model.token = chunk.token;
        model.syncHistory(chunk.messages, function(needToRender){
            if(needToRender)
                view.render(model);
        });
    });
}

function sendMsg(){
    view.render(model.state.sending);
    var newMessage = model.theMessage(view.getNewMessage());
    if(newMessage == '')
        return;
    client.postMessage(model.mainUrl, newMessage, function () {
        view.render(model.state.finishSending);
    });
}

function editMsgComplete(evtObj){
    var updatedMessage = {
        id: view.getUpdatedMsgId(evtObj),
        text: view.getUpdatedMsg(evtObj),
        user: model.user
    };
    client.editMessage(model.mainUrl, updatedMessage, function () {
        view.render(model.state.completeEditing);
    });
}

function deleteMsg(evtObj){
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

function editMsgCancel(evtObj){
    view.setState(evtObj, 'new');
}

window.onerror = function(err) {
   // output(err.toString());
};

function editUsernameBegin(evtObj){
    view.setUsernameState(evtObj, 'edit');
    view.inputUsername.focus();
}

function editUsernameComplete(evtObj){
    model.user = view.getUsername();
    view.loadUser(model);
    view.setUsernameState(evtObj, 'initial');
}

function changeServer(){}

function showTypeheads(){
   // $('.typeahead').typeahead();
}