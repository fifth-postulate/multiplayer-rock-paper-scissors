module.exports = function difference(universe, subset){
    return universe.filter(function(element){
        return subset.indexOf(element) === -1;
    });
}
