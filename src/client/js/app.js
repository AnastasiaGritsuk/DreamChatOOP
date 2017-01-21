'use strict';

module.exports = (function () {
    function App(client, view, model) {
        this.client = client;
        this.view = view;
        this.model = model;

        view.on('ready', ()=> this.run());
        view.on('sendMsg', (newMsg)=> this.sendMsg(newMsg));
        view.on('editMsgComplete', (id, text)=> this.editMsgComplete(id, text));
        view.on('deleteMsg', (id)=> this.deleteMsg(id));
        view.on('editUsernameComplete', (user)=> this.editUsernameComplete(user));

        window.onerror = (err)=> {
            // output(err.toString());
        };
    }

    App.prototype.run = function () {
        this.view.loadUser(this.model);
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

        this.view.render(this.model.state.sending);
        var newMessage = this.model.theMessage(newMsg);
        this.client.postMessage(this.model.mainUrl, newMessage, () => {
            this.view.render(this.model.state.finishSending);
        }, (error)=> {
            this.errorHandler(error);
        });
    };

    App.prototype.editMsgComplete = function (id, text) {
        var updatedMessage = {
            id: id,
            text: text,
            user: this.model.user
        };
        this.client.editMessage(this.model.mainUrl, updatedMessage, ()=> {
            this.view.render(this.model.state.completeEditing);
        }, (error)=> {
            this.errorHandler(error);
        });
    };

    App.prototype.deleteMsg = function (id) {
        this.client.deleteMessage(this.model.mainUrl, id,  ()=> {
            this.view.render(this.model.state.completeDeleting)
        },  (error)=> {
            this.errorHandler(error);
        });
    };

    App.prototype.editUsernameComplete = function (user) {
        this.model.user = user;
        this.view.loadUser(this.model);
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




