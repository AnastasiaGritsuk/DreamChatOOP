module.exports = (function () {
    function AppState() {
        this.user = 'User' + this.uniqueId(),
        this.mainUrl =  'http://localhost:8080/chat',
        this.history = [],
        this.token =  ''
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
    
    return AppState;
})();