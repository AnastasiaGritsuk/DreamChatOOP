module.exports = (function () {
    function CurrentMessage(_value, _state) {
        this.value = _value;
        this.state = _state;
    }

    CurrentMessage.prototype.set = function (_value, _state) {
        this.value = _value;
        this.state = _state;
    };

    return CurrentMessage;
})();