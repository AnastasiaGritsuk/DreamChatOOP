function AppState() {
    this.uniqueId = function() {
        var date = Date.now();
        var random = Math.random() * Math.random();

        return Math.floor(date * random).toString();
    };
    this.appState = {
        user: 'User' + uniqueId(),
        mainUrl: 'http://localhost:8080/chat',
        history:[],
        token: ''
    }
}

AppState.prototype.isLocalUser = isLocalUser;

function isLocalUser(user){
    return user != appState.user;
}

module.exports = AppState;