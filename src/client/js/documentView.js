var Emitter = require('component-emitter');

function DocumentView() {
    Emitter(this);
    this.historyBox = document.getElementById('chatBoxId');
    this.inputUsername = document.getElementsByClassName('icon-input')[0];
    this.username = document.getElementById('username');
    this.sendButton = document.getElementById('sendButton');
    this.newMessageBox = document.getElementById('msgBox_textareaId');
    document.addEventListener('click', (evtObj)=>{
        this.delegateEvent(evtObj);
    });
}

DocumentView.prototype.isProperElement = function(e, classname){
    return e.path[1].className === classname;
}

DocumentView.prototype.delegateEvent = function (evtObj){
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'btn sendButton')) {
        DocumentView.emit('sendButtonClick');
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon edit')) {
        DocumentView.emit('editClick');
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon cancel')) {
        DocumentView.emit('editCancelClick');
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon complete')) {
        DocumentView.emit('editCompleteClick');
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon delete')) {
        DocumentView.emit('deleteClick');
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOn-username')) {
        DocumentView.emit('editUsernameClick');
        return;
    }

    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOff-username')) {
        DocumentView.emit('editCompleteUsernameClick');
        return;
    }
}

var documentView = new DocumentView();

module.exports = documentView;