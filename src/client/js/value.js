module.exports = (function () {
    function Value(value, state) {
        this.value = value;
        this.state = state;
    }

    Value.prototype.changing = function () {
        this.state = 'changing';
    };

    Value.prototype.completed = function (text) {
        this.value = text;
        this.state = 'completed';
    };

    Value.prototype.isChanging = function () {
        return this.state == 'changing';
    };
    
    return Value;
})();