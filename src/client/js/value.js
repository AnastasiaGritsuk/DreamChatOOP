module.exports = (function () {
    function Value(_value, _state) {
        this.value = _value;
        this.state = _state;
    }

    Value.prototype.changing = function () {
        this.state = 'changing';
    };

    Value.prototype.completed = function (text) {
        this.value = text;
        this.state = 'completed';
    };

    Value.prototype.isReady = function () {
        return this.state == 'completed';
    };
    
    return Value;
})();