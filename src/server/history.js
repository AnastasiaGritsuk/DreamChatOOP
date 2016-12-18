function History() {
	this.messageHistory = [];
}

History.prototype.post = function(newMessage, callback){
	newMessage.status = "new";
	this.messageHistory.push(newMessage);
	callback();
}

History.prototype.put = function(newMessage, callback){
	newMessage.status = "edited";
	this.messageHistory.push(newMessage);
	callback();
}


History.prototype.get = function(token, callback){
	var answer = [];

	for(var i=token;i<this.messageHistory.length;i++){
		this.messageHistory[i].time = getDateTime();
		answer.push(this.messageHistory[i]);
	}

	callback(answer, this.messageHistory.length);
}

History.prototype.delete = function(id, callback){
	this.messageHistory.push(
	{
		"id":id,
		"text": "message has been removed",
		"user": '',
		"status": "deleted"
	});
	
	callback();
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return hour + ":" + min;
}

module.exports = History;

