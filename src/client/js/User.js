module.exports = (function () {
    function User(_value, _state) {
        this.value = _value;
        this.state = _state;
    }
    
    User.prototype.set = function (_value, _state) {
        this.value = _value;
        this.state = _state;
    };
    
    return User;
})();