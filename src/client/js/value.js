module.exports = (function () {
    function Value(_value, _state) {
        this.value = _value;
        this.state = _state;
    }

    Value.prototype.set = function (_state, _value) {
        if(_value !== undefined) {
            this.value = _value;
        }
        this.state = _state;
    };
    
    return Value;
})();