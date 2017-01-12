var Emitter = require('component-emitter');

function DocumentView() {
    Emitter(this);
    this.historyBox = document.getElementById('chatBoxId');
    this.inputUsername = document.getElementsByClassName('icon-input')[0];
    this.username = document.getElementById('username');
    this.sendButton = document.getElementById('sendButton');
    this.newMessageBox = document.getElementById('msgBox_textareaId');
    document.addEventListener('DOMContentLoaded', ()=>{
        this.emit('ready');
    });
    document.addEventListener('click', (evtObj)=>{
        this.delegateEvent(evtObj);
    });
}

DocumentView.prototype.isProperElement = function(e, classname){
    return e.path[1].className === classname;
}

DocumentView.prototype.delegateEvent = function (evtObj){
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'btn sendButton')) {
        this.emit('sendButtonClick', evtObj);
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon edit')) {
        this.emit('editClick', evtObj);
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon cancel')) {
        this.emit('editCancelClick', evtObj);
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon complete')) {
        this.emit('editCompleteClick', evtObj);
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon delete')) {
        this.emit('deleteClick', evtObj);
        return;
    }
    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOn-username')) {
        this.emit('editUsernameClick', evtObj);
        return;
    }

    if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOff-username')) {
        this.emit('editCompleteUsernameClick', evtObj);
        return;
    }
}

module.exports = DocumentView;