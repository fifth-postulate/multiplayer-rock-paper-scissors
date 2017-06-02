function Distribution(groups) {
    this.keys = [];
    this.frequencies = {};
    for (let k in groups) {
        if (groups.hasOwnProperty(k)) {
            this.keys.push(k);
            this.frequencies[k] = groups[k].length;
        }
    }
}
Distribution.prototype.allSame = function(){
    const targetValue = this.frequencies[this.keys[0]];
    return this.keys
        .map(function(k){ return this.frequencies[k] === targetValue; }.bind(this))
        .reduce(function(acc, current){ return acc && current; }, true);
};
Distribution.prototype.minmax = function(){
    const target = this.keys
              .map(function(k){ return this.frequencies[k]; }.bind(this))
              .reduce(function(acc, v){ return Math.max(acc, v); }, 0);
    const minorants = [], majorants = [];
    this.keys.forEach(function(k){
        if (this.frequencies[k] === target) {
            majorants.push(k);
        } else {
            minorants.push(k);
        }
    }.bind(this));
    return {
        minorants: minorants,
        majorants: majorants
    };
};

module.exports = Distribution;
