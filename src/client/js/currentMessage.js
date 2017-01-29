module.exports = (function () {
    function CurrentMessage(_value, _state) {
        this.value = _value;
        this.state = _state;
        this.target = null;
    }

    CurrentMessage.prototype.set = function (_value, _state) {
        this.value = _value;
        this.state = _state;
    };

    return CurrentMessage;
})();