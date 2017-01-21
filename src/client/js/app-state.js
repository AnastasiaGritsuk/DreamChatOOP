'use strict';

module.exports = (function () {
    function AppState() {
        this.user = 'User' + this.uniqueId(),
        this.mainUrl =  'http://localhost:8080/chat',
        this.history = [],
        this.token =  '',
        // this.mode = {
        //     sending: 1,
        //     finishSending: 2,
        //     completeEditing: 4,
        //     beginDeleting: 5,
        //     completeDeleting: 6
        // }
        
        this.mode = {};
    }

    AppState.prototype.isLocalUser = function (user){
        return user != this.user;
    };

    AppState.prototype.uniqueId = function() {
        var date = Date.now();
        var random = Math.random() * Math.random();

        return Math.floor(date * random).toString();
    };

    AppState.prototype.theMessage = function(text){
        return {
            id: this.uniqueId(),
            text:text,
            user: this.user
        }
    };

    AppState.prototype.syncHistory = function (token, messages){
        this.token = token;
        
        if(messages.length == 0) 
            return false;
        
        var msgMap = this.history.reduce(function(accumulator, msg){
            accumulator[msg.id] = msg;

            return accumulator;
        },{});

        for(var i=0;i<messages.length;i++){
            var id = messages[i].id;
            var item = msgMap[id];

            if(item == null){
                this.history.push(messages[i]);
                continue;
            }
            item.text = messages[i].text;
            item.status = messages[i].status;
        }
        
        return true;
    };
    
    return AppState;
})();