var uniqueId = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};

function isCurrentUser(user){
    return user != appState.user;
}

var appState = {
    user: 'User' + uniqueId(),
    mainUrl: 'http://localhost:8080/chat',
    history:[],
    token: ''
}

module.exports = {
    appState:appState,
    uniqueId:uniqueId,
    isCurrentUser:isCurrentUser
};