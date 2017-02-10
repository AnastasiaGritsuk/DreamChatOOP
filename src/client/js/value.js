module.exports = (function () {
    function Value(value, ready) {
        this.value = value;
        this.ready = ready;
    }

    Value.prototype.changing = function () {
        this.ready = false;
    };

    Value.prototype.completed = function (value) {
        this.value = value;
        this.ready = true;
    };

    Value.prototype.isCompleted = function () {
        return this.ready;
    };
    
    return Value;
})();