var app = require('./app');
var Emitter = require('component-emitter');
var emitter = new Emitter;

document.addEventListener("DOMContentLoaded", function () {
    emitter.emit('DOMContentLoaded');
});
document.addEventListener('click', function (evtObj) {
    delegateEvent(evtObj);
});

var newMessageBox = document.getElementById('msgBox_textareaId');
var sendButton = document.getElementById('sendButton');
var inputUsername = document.getElementsByClassName('icon-input')[0];
var username = document.getElementById('username');

function delegateEvent(evtObj){
    if(evtObj.type == 'click' && isProperElement(evtObj, 'btn sendButton')) {
        emitter.emit('sendButtonClick', function (element, enterKey) {
            if(element.getAttribute('disabled') && enterKey)
                return false;

            element.setAttribute('disabled', 'disabled');

            var newMessage = theMessage(newMessageBox.value);
            if(newMessageBox.value == '')
                return;

            newMessageBox.value = '';
        });
        return;
    }
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon edit')) {
        emitter.emit('editClick');
        return;
    }
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon cancel')) {
        emitter.emit('editCancelClick');
        return;
    }
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon complete')) {
        emitter.emit('editCompleteClick');
        return;
    }
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon delete')) {
        emitter.emit('deleteClick');
        return;
    }
    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOn-username')) {
        emitter.emit('editUsernameClick');
        return;
    }

    if(evtObj.type == 'click' && isProperElement(evtObj, 'icon editOff-username')) {
        emitter.emit('editCompleteUsernameClick');
        return;
    }
}

function isProperElement(e, classname){
    return e.path[1].className === classname;
}

emitter.on('editClick', onEditClick);
emitter.on('editCancelClick', onEditCancelClick);
emitter.on('editUsernameClick', onEditUsernameClick);
emitter.on('editCompleteUsernameClick', onEditCompleteUsernameClick);

function onEditClick(evtObj){
    sendButton.setAttribute('disabled', 'disabled');
    var current = evtObj.target.shadowRoot.children[1];
    current.dataset.state = "edit";
}

function onEditCancelClick(evtObj){
    evtObj.target.shadowRoot.children[1].dataset.state = "new";
}

function onEditUsernameClick(evtObj){
    evtObj.path[2].dataset.state = "edit";
    inputUsername.focus();
}

function onEditCompleteUsernameClick(evtObj){
    appStateModel.appState.user = inputUsername.value;
    loadUser();
    evtObj.path[2].dataset.state = "initial";
}

var historyBox = document.getElementById('chatBoxId');

function render(appStateModel){
    if(appStateModel.appState.history.length === 0)
        return;

    var msgMap = appStateModel.appState.history.reduce(function(accumulator, msg){
        accumulator[msg.id] = msg;

        return accumulator;
    },{});

    updateList(historyBox, msgMap);
    appendToList(historyBox, appStateModel.appState.history, msgMap, appStateModel.isLocalUser);
}

function updateList(element, msgMap){
    var children = element.children;

    for(var i=0;i<children.length;i++){
        var child = children[i];
        var id = child.attributes['id'].value;
        var item = msgMap[id];
        renderItemState(child.shadowRoot.children[1], item);
        msgMap[id] = null;
    }
}

function appendToList(element, items, msgMap, isLocalUser){
    for(var i=0; i<items.length; i++){
        var item = items[i];

        if(msgMap[item.id] == null)
            continue;

        msgMap[item.id] = null;

        var msgWpapper = document.createElement('div');
        msgWpapper.setAttribute('id', item.id);
        element.appendChild(msgWpapper);

        var root1 = document.getElementById(item.id).createShadowRoot();
        var template = msgFromTemplate(isLocalUser(item.user));
        renderItemState(template.children[1], item);

        root1.appendChild(template);
    }
}

function msgFromTemplate(mode){
    var template = document.getElementById('msg-template');
    var clone = document.importNode(template.content, true);

    if(mode){
        clone.children[1].classList.add('other');
    }

    return clone;
}

function renderItemState(item, message){
    item.setAttribute('id', message.id);
    item.dataset.state = message.status;
    item.getElementsByClassName('msg-username')[0].innerHTML = message.user;
    item.getElementsByClassName('msg-text')[0].innerHTML = message.text;
    item.getElementsByClassName('msg-time')[0].innerHTML = message.time;
}

module.exports = {
    render:render,
    emitter:emitter
};