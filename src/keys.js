module.exports = function keys(dictionary) {
    const keys = [];
    for (let k in dictionary) {
        if (dictionary.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
}

