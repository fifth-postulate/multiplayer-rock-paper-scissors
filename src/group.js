module.exports = function group(dictionary) {
    const groups = {};
    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            let value = dictionary[key];
            if (!(value in groups)) { groups[value] = []; }
            groups[value].push(key);
        }
    }
    return groups;
};
