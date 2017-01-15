var Emitter = require('component-emitter');

module.exports = (function () {
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
        this.newMessageBox.addEventListener('keypress', (evtObj)=>{
            if(evtObj.keyCode==13) {
                this.emit('sendMsg', evtObj);
                evtObj.preventDefault();
            }
        });
        this.on('editMsgBegin', this.editMsgBegin);
    }

    DocumentView.prototype.isProperElement = function(e, classname){
        return e.path[1].className === classname;
    };

    DocumentView.prototype.delegateEvent = function (evtObj){
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'btn sendButton')) {
            this.emit('sendMsg', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon edit')) {
            this.emit('editMsgBegin', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon complete')) {
            this.emit('editMsgComplete', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon cancel')) {
            this.emit('editMsgCancel', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon delete')) {
            this.emit('deleteMsg', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOn-username')) {
            this.emit('editUsernameBegin', evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(evtObj, 'icon editOff-username')) {
            this.emit('editUsernameComplete', evtObj);
            return;
        }
    };

    DocumentView.prototype.editMsgBegin = function (evtObj){
        this.changeSendBtnState('enabled');
        this.setState(evtObj, 'edit');
    }

    DocumentView.prototype.render = function (modelRoot) {
        if(modelRoot == 1) {
            if(this.sendButton.getAttribute('disabled'))
                return;
            this.changeSendBtnState('disabled');
            return;
        }        
        if(modelRoot == 2) {
            this.changeSendBtnState('enabled');
            this.newMessageBox.value = '';
            return;
        }
       
        if(modelRoot.history.length === 0)
            return;
        var msgMap = modelRoot.history.reduce(function(accumulator, msg){
            accumulator[msg.id] = msg;
            return accumulator;
        },{});
        this.updateList(this.historyBox, msgMap);
        this.appendToList(this.historyBox, modelRoot.history, msgMap, modelRoot);
    };

    DocumentView.prototype.updateList = function (element, msgMap) {
        var children = element.children;
        for(var i=0;i<children.length;i++){
            var child = children[i];
            var id = child.attributes['id'].value;
            var item = msgMap[id];
            this.renderItemState(child.shadowRoot.children[1], item);
            msgMap[id] = null;
        }
    };

    DocumentView.prototype.appendToList = function (element, items, msgMap, modelRoot) {
        for(var i=0; i<items.length; i++){
            var item = items[i];

            if(msgMap[item.id] == null)
                continue;
            msgMap[item.id] = null;
            var msgWpapper = document.createElement('div');
            msgWpapper.setAttribute('id', item.id);
            this.historyBox.appendChild(msgWpapper);
            var root1 = document.getElementById(item.id).createShadowRoot();
            var template = this.msgFromTemplate(modelRoot.isLocalUser(item.user));
            this.renderItemState(template.children[1], item);
            root1.appendChild(template);
        }
    };

    DocumentView.prototype.msgFromTemplate = function (mode) {
        var template = document.getElementById('msg-template');
        var clone = document.importNode(template.content, true);
        if(mode){
            clone.children[1].classList.add('other');
        }
        return clone;
    };

    DocumentView.prototype.renderItemState = function (item, message) {
        item.setAttribute('id', message.id);
        item.dataset.state = message.status;
        item.getElementsByClassName('msg-username')[0].innerHTML = message.user;
        item.getElementsByClassName('msg-text')[0].innerHTML = message.text;
        item.getElementsByClassName('msg-time')[0].innerHTML = message.time;
    };
    
    DocumentView.prototype.getCurrentMsgContainer = function (evtObj) {
        return evtObj.target.shadowRoot.children[1] || evtObj.path[2];
    };

    DocumentView.prototype.getUsernameContainer = function (evtObj) {
        return evtObj.path[2];
    };

    DocumentView.prototype.changeSendBtnState = function (mode) {
        switch(mode) {
            case 'enabled':  this.sendButton.removeAttribute('disabled');
                break;
            case 'disabled':  this.sendButton.setAttribute('disabled','disabled');
        }
    };

    DocumentView.prototype.setState = function (evtObj, state) {
        this.getCurrentMsgContainer(evtObj).dataset.state = state;
    };
    
    DocumentView.prototype.getUsername = function () {
        return this.inputUsername.value;
    };
    
    DocumentView.prototype.getNewMessage = function () {
        return this.newMessageBox.value;
    };
    
    DocumentView.prototype.setUsernameState = function (evtObj, state) {
        this.getUsernameContainer(evtObj).dataset.state = state;
    };

    DocumentView.prototype.loadUser = function (model){
        this.username.innerHTML = model.user;
    };
    return DocumentView;
})();

