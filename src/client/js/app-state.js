module.exports = (function () {
    function AppState() {
        this.user = 'User' + this.uniqueId(),
        this.mainUrl =  'http://localhost:8080/chat',
        this.history = [],
        this.token =  '',
        this.state = {
            initial: 0,
            sending: 1,
            finishSending: 2,
            completeEditing: 4,
            beginDeleting: 5,
            completeDeleting: 6
        }
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

    AppState.prototype.syncHistory = function (newMsg, callback){
        if(newMsg.length === 0){
            callback();
            return;
        }
        var msgMap = this.history.reduce(function(accumulator, msg){
            accumulator[msg.id] = msg;

            return accumulator;
        },{});

        for(var i=0;i<newMsg.length;i++){
            var id = newMsg[i].id;
            var item = msgMap[id];

            if(item == null){
                this.history.push(newMsg[i]);
                continue;
            }
            item.text = newMsg[i].text;
            item.status = newMsg[i].status;
        }
        callback(true);
    };
    
    return AppState;
})();