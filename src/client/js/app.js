var AppState = require('./app-state');
var DocumentView = require('./documentView');
var Client = require('./client');

var model = new AppState();
var view = new DocumentView();
var client = new Client();

view.on('ready', run);
view.on('sendButtonClick', onSendButtonClick);
view.on('editCompleteClick', onEditComplete);
view.on('deleteClick', onDeleteClick);
view.on('editClick', onEditClick);
view.on('editCancelClick', onEditCancelClick);
view.on('editUsernameClick', onEditUsernameClick);
view.on('editCompleteUsernameClick', onEditCompleteUsernameClick);

function run(){
    loadUser();
    view.newMessageBox.addEventListener('keypress', function(e){

        showTypeheads();

        if(e.keyCode == 13){
            onSendButtonClick(true);
            e.preventDefault();
        }
        
        return false;
    });

    view.sendButton.addEventListener('click', onSendButtonClick);
    doPolling(function(chunk){
        model.token = chunk.token;
        syncHistory(chunk.messages, function(needToRender){
            if(needToRender)
                view.render(model);
        });
    });
}

function loadUser(){
    view.username.innerHTML = model.user;
}

function onSendButtonClick(enterkey){
    if(view.sendButton.getAttribute('disabled') && enterkey)
        return false;

    view.sendButton.setAttribute('disabled', 'disabled');

    var newMessage = model.theMessage(view.newMessageBox.value);

    if(view.newMessageBox.value == '')
        return;

    view.newMessageBox.value = '';

    client.postMessage(model.mainUrl, newMessage, function () {
        view.sendButton.removeAttribute('disabled');
    });
}

function onEditClick(evtObj){
    view.sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target.shadowRoot.children[1];
    current.dataset.state = "edit";
}

function onEditComplete(evtObj){
    var current = evtObj.target.shadowRoot.children[1];
    var input = current.getElementsByClassName('msg-editedText')[0];

    var updatedMessage = {
        id: current.id,
        text: input.value,
        user: model.user
    };

    client.editMessage(model.mainUrl, updatedMessage, function () {
        view.sendButton.removeAttribute('disabled');
    });
}

function onDeleteClick(evtObj){
    view.sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target;

    client.deleteMessage(model.mainUrl, current.id, function () {
        view.sendButton.removeAttribute('disabled');
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

function onEditCancelClick(evtObj){
    evtObj.target.shadowRoot.children[1].dataset.state = "new";
}

function syncHistory(newMsg, callback){
    if(newMsg.length === 0){
        callback();
        return;
    }

    var msgMap = model.history.reduce(function(accumulator, msg){
        accumulator[msg.id] = msg;

        return accumulator;
    },{});

    for(var i=0;i<newMsg.length;i++){
        var id = newMsg[i].id;
        var item = msgMap[id];

        if(item == null){
            model.history.push(newMsg[i]);
            continue;
        }

        item.text = newMsg[i].text;
        item.status = newMsg[i].status;
    }

    callback(true);
}

window.onerror = function(err) {
   // output(err.toString());
};

function onEditUsernameClick(evtObj){
   evtObj.path[2].dataset.state = "edit";
    view.inputUsername.focus();
}

function onEditCompleteUsernameClick(evtObj){
    model.user = view.inputUsername.value;
    loadUser();
    evtObj.path[2].dataset.state = "initial";
}

//change server

function changeServer(){

}

function showTypeheads(){
   // $('.typeahead').typeahead();
}

function isError(text) {

};