'use strict';

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
                this.sendMsg();
                evtObj.preventDefault();
            }
        });
    }

    DocumentView.prototype.isProperElement = function(target, className){
        return target.className === className;
    };

    DocumentView.prototype.getUpdatedMsgId = function (evtObj) {
        var current = this.getCurrentMsgContainer(evtObj);
        return current.id;
    };

    DocumentView.prototype.getUpdatedMsg = function (evtObj) {
        var current = this.getCurrentMsgContainer(evtObj);
        var input = current.getElementsByClassName('msg-editedText')[0];
        
        return input.value;
    };
    
    DocumentView.prototype.delegateEvent = function (evtObj){
        var target = evtObj.path[1];
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon-location-arrow')) {
            this.sendMsg();
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon edit')) {
            this.editMsgBegin(evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon complete')) {
            this.editMsgComplete(evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon cancel')) {
            this.editMsgCancel(evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon delete')) {
            this.deleteMsg(evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon editOn-username')) {
            this.editUsernameBegin(evtObj);
            return;
        }
        if(evtObj.type == 'click' && this.isProperElement(target, 'icon editOff-username')) {
            this.editUsernameComplete(evtObj);
            return;
        }
    };

    DocumentView.prototype.editMsgBegin = function (evtObj){
        this.changeSendBtnState('disabled');
        this.setState(evtObj, 'edit');
    };

    DocumentView.prototype.editMsgCancel = function(evtObj){
        this.setState(evtObj, 'new');
    };

    DocumentView.prototype.editUsernameBegin = function(evtObj){
        this.setUsernameState(evtObj, 'edit');
        this.inputUsername.focus();
    };
    
    DocumentView.prototype.editMsgComplete = function (evtObj) {
        var id = this.getUpdatedMsgId(evtObj);
        var text = this.getUpdatedMsg(evtObj);
        this.emit('editMsgComplete', id, text);
    };

    DocumentView.prototype.sendMsg = function () {
        var newMsg = this.newMessageBox.value;
        this.emit('sendMsg', newMsg.trim());
    };

    DocumentView.prototype.deleteMsg = function (evtObj) {
        var id = this.getUpdatedMsgId(evtObj);
        this.emit('deleteMsg', id);
    };
    
    DocumentView.prototype.editUsernameComplete = function (evtObj) {
        var user = this.inputUsername.value;
        this.setUsernameState(evtObj, 'initial');
        this.emit('editUsernameComplete', user);
    };

    DocumentView.prototype.renderMode = function (mode) {
        if(mode == 'started') {
            if(this.sendButton.getAttribute('disabled'))
                return;
            this.changeSendBtnState('disabled');
            return;
        }
        if(mode == 'finishSending') {
            this.changeSendBtnState('enabled');
            this.newMessageBox.value = '';
            return;
        }

        if(mode == 'completed') {
            this.changeSendBtnState('enabled');
            return;
        }
    };

    DocumentView.prototype.renderUser = function (user) {
        this.username.innerHTML = user;
    };

    DocumentView.prototype.renderHistory = function (history) {
        if(history.length === 0)
            return;
        var msgMap = history.reduce(function(accumulator, msg){
            accumulator[msg.id] = msg;
            return accumulator;
        },{});
        this.updateList(this.historyBox, msgMap);
        this.appendToList(this.historyBox, history, msgMap);
    };

    DocumentView.prototype.render = function (modelRoot) {
        console.assert(modelRoot !== null);
        
        this.renderMode(modelRoot.mode);
        this.renderUser(modelRoot.user);
        //this.renderServerList(modelRoot.serverList);
        this.renderHistory(modelRoot.history);
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

    DocumentView.prototype.appendToList = function (element, items, msgMap) {
        for(var i=0; i<items.length; i++){
            var item = items[i];

            if(msgMap[item.id] == null)
                continue;
            msgMap[item.id] = null;
            var msgWpapper = document.createElement('div');
            msgWpapper.setAttribute('id', item.id);
            this.historyBox.appendChild(msgWpapper);
            var root1 = document.getElementById(item.id).createShadowRoot();
            var template = this.msgFromTemplate(item.user);
            this.renderItemState(template.children[1], item);
            root1.appendChild(template);
        }
    };

    DocumentView.prototype.msgFromTemplate = function (user) {
        var template = document.getElementById('msg-template');
        var clone = document.importNode(template.content, true);
        if(user !== this.getUsername()){
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
        return this.username.innerHTML;
    };
    
    DocumentView.prototype.setUsernameState = function (evtObj, state) {
        this.getUsernameContainer(evtObj).dataset.state = state;
    };

    return DocumentView;
})();