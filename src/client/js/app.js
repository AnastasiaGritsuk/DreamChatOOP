'use strict';

module.exports = (function () {
    function App(client, view, model) {
        this.client = client;
        this.view = view;
        this.model = model;

        view.on('ready', ()=> this.run());
        view.on('sendMsg', (newMsg)=> this.sendMsg(newMsg));
        view.on('editMsgBegin', (targetId)=>this.editMsgBegin(targetId));
        view.on('editMsgComplete', (id, text)=> this.editMsgComplete(id, text));
        view.on('deleteMsg', (id)=> this.deleteMsg(id));
        view.on('editUsernameBegin', ()=>this.editUsernameBegin());
        view.on('editUsernameComplete', (user)=> this.editUsernameComplete(user));
        view.on('editMsgCancel', (user)=> this.editMsgCancel());

        window.onerror = (err)=> {
            // output(err.toString());
        };
    }

    App.prototype.run = function () {
        this.view.render(this.model);
        this.doPolling((chunk)=> {
            if (this.model.syncHistory(chunk.token, chunk.messages)) {
                this.view.render(this.model);
            }
        });
    };

    App.prototype.doPolling = function (callback) {
        let loop = ()=> {
            this.client.getHistory(this.model.mainUrl, this.model.token, (response) => {
                let answer = JSON.parse(response);

                callback(answer);
                setTimeout(loop, 1000);
            },(error)=> {
                this.errorHandler(error);
            });
        };

        loop();
    };

    App.prototype.sendMsg = function (newMsg) {
        if (newMsg.length == 0)
            return;

        this.model.currentMessage.state = 'changing';
        this.view.render({currentMessage: this.model.currentMessage});
        var newMessage = this.model.theMessage(newMsg);
        this.client.postMessage(this.model.mainUrl, newMessage, () => {
            this.model.currentMessage.state = 'completed';
            this.view.render({currentMessage: this.model.currentMessage});
        }, (error)=> {
            this.errorHandler(error);
        });
    };
    
    App.prototype.editMsgBegin = function (targetId) {
        this.model.currentMessage.state = 'changing';
        this.model.currentMessage.target = targetId;
        this.view.render({currentMessage: this.model.currentMessage});
    };

    App.prototype.editMsgComplete = function (text) {
        var updatedMessage = {
            id: this.model.currentMessage.target,
            text: text,
            user: this.model.user
        };
        this.client.editMessage(this.model.mainUrl, updatedMessage, ()=> {
            this.model.currentMessage.state = 'completed';
            this.view.render({currentMessage: this.model.currentMessage});
        }, (error)=> {
            this.errorHandler(error);
        });
    };
    
    App.prototype.editMsgCancel = function () {
        this.model.currentMessage.state = 'completed';
        this.view.render({currentMessage: this.model.currentMessage});
    };

    App.prototype.deleteMsg = function (id) {
        this.model.currentMessage.state = 'changing';
        this.view.render({currentMessage: this.model.currentMessage});
        this.client.deleteMessage(this.model.mainUrl, id,  ()=> {
            this.model.currentMessage.state = 'completed';
            this.view.render({currentMessage: this.model.currentMessage});
        },  (error)=> {
            this.errorHandler(error);
        });
    };
    
    App.prototype.editUsernameBegin = function () {
        this.model.user.changing();
        this.view.render({user: this.model.user});
    };

    App.prototype.editUsernameComplete = function (userName) {
        this.model.user.completed(userName);
        this.view.render({user: this.model.user});
    };

    App.prototype.changeServer = function () {
    };

    App.prototype.showTypeheads = function() {
        // $('.typeahead').typeahead();
    };

    App.prototype.errorHandler = function (error) {
        console.log('Error was occurred ' + error);
    };
    
    return App;
})();