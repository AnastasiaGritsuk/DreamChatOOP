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

function sendMsg(newMsg){
    view.render(model.state.sending);
    var newMessage = model.theMessage(newMsg);
    if(newMessage == '')
        return;
    client.postMessage(model.mainUrl, newMessage, function () {
        view.render(model.state.finishSending);
    });
}

function editMsgComplete(id, text){
    var updatedMessage = {
        id: id,
        text: text,
        user: model.user
    };
    client.editMessage(model.mainUrl, updatedMessage, function () {
        view.render(model.state.completeEditing);
    });
}

function deleteMsg(id){
    client.deleteMessage(model.mainUrl, id, function () {
        view.render(model.state.completeDeleting)
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

window.onerror = function(err) {
   // output(err.toString());
};

function editUsernameComplete(evtObj){
    model.user = view.getUsername();
    view.loadUser(model);
    view.setUsernameState(evtObj, 'initial');
}

function changeServer(){}

function showTypeheads(){
   // $('.typeahead').typeahead();
}