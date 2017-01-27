'use strict';
var User = require('./user');

module.exports = (function () {
    function AppState(user) {
        this.user = user;
        this.mainUrl = 'http://localhost:8080/chat',
        this.history = [],
        this.token =  '',        
        this.mode = {};
    }
    
    AppState.prototype.theMessage = function(text){
        return {
            id: this.uniqueId(),
            text:text,
            user: this.user.value
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