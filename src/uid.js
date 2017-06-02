module.exports = function uid(len) {
    len = len || 6;
    return Math.random().toString(35).substr(2, len);
}
