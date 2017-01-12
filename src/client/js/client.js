function Client() {
    
}

Client.prototype.ajax = function (method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError || function (err) {
            console.error(err);
        };
    xhr.open(method || 'GET', url, true);

    xhr.onload = ()=>{
        if(xhr.readyState !==4)
            return;

        if(xhr.status !=200){
            continueWithError('Error on the server side, response ' + xhr.status);
            return;
        }
        if(this.isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            return;
        }
        continueWith(xhr.responseText);
    };
    xhr.ontimeout = function(){
        continueWithError('Server timed out !');
    };
    xhr.onerror = function (e) {
        continueWithError(e);
    };
    xhr.send(data);
};
Client.prototype.isError = function (text) {
    if(text == "")
        return false;

    try{
        var obj = JSON.parse(text);
    }catch(ex){
        return true;
    }

    return !!obj.error;
};

module.exports = Client;