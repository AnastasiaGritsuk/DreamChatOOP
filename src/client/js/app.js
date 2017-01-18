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
        if(chunk.messages.length !== 0) {
            model.syncHistory(chunk.messages);
            view.render(model);
        }
    });
}

function sendMsg(newMsg){
    if(newMsg.length == 0) return;
    view.render(model.state.sending);
    var newMessage = model.theMessage(newMsg);
    client.postMessage(model.mainUrl, newMessage, function () {
        view.render(model.state.finishSending);
    }, function (error) {
        errorHandler(error);
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
    }, function (error) {
        errorHandler(error);
    });
}

function deleteMsg(id){
    client.deleteMessage(model.mainUrl, id, function () {
        view.render(model.state.completeDeleting)
    }, function (error) {
        errorHandler(error);
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

function editUsernameComplete(user){
    model.user = user;
    view.loadUser(model);
}

function errorHandler(error) {
    console.error(error);
}
window.onerror = function(err) {
    errorHandler(err);
};

function changeServer(){}

function showTypeheads(){
   // $('.typeahead').typeahead();
}