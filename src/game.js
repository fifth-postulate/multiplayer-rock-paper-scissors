const uid = require('./uid');
const group = require('./group');
const resolve = require('./resolve');

function Game() {
    this.id = uid(10);
    this.players = {};
    this.picks = {};
}
Game.prototype.registerPlayer = function(){
    if (!this.finished()) {
        do {
            var id = uid();
        } while(id in this.players);
        this.players[id] = true;
        return id;
    } else {
        return undefined;
    }
};
Game.prototype.registeredPlayers = function(){
    var players = [];
    for (let player in this.players) {
        if (this.players.hasOwnProperty(player)) {
            players.push(player);
        }
    }
    return players;
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
    const {winners, losers} = resolve(groups, this.registeredPlayers());
    this.resolution = {
        winners: winners,
        losers: losers
    };
};
Game.prototype.finished = function(){
    return !!(this.resolution);
};

module.exports = Game;
