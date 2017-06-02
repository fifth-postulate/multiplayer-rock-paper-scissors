const uid = require('./uid');
const group = require('./group');
const resolve = require('./resolve');

function Game() {
    this.players = {};
    this.picks = {};
}
Game.prototype.registerPlayer = function(){
    do {
        var id = uid();
    } while(id in this.players);
    this.players[id] = true;
    return id;
};
Game.prototype.pick = function(playerId, choice){
    this.picks[playerId] = choice;
};
Game.prototype.winners = function(){
    if (!this.resolution) { this.resolve(); }
    return this.resolution.winners;
};
Game.prototype.losers = function(){
    if (!this.resolution) { this.resolve(); }
    return this.resolution.losers;
};
Game.prototype.resolve = function(){
    const groups = group(this.picks);
    const {winners, losers} = resolve(groups);
    this.resolution = {
        winners: winners,
        losers: losers
    };
}

module.exports = Game;
