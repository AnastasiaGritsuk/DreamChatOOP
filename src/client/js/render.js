var app = require('./app');
var Emitter = require('component-emitter');
var emitter = new Emitter;

document.addEventListener("DOMContentLoaded", function () {
    emitter.emit('DOMContentLoaded');
});
document.addEventListener('click', function (evtObj) {
    emitter.emit('clickOnDom', evtObj);
});


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