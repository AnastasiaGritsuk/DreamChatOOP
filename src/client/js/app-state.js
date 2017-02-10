'use strict';
var User = require('./value');
var CurrentMessage = require('./currentMessage');

module.exports = (function () {
    function AppState() {
        this.user = new User('User' + this.uniqueId(), true);
        this.mainUrl =  'http://localhost:8080/chat',
        this.history = [],
        this.token =  '',        
        this.currentMessage = new CurrentMessage(null, null);
    }

    AppState.prototype.uniqueId = function() {
        var date = Date.now();
        var random = Math.random() * Math.random();

        return Math.floor(date * random).toString();
    };

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