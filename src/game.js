const uid = require('./uid');
const group = require('./group');
const resolve = require('./resolve');
const Observable = require('./observable');

function Game() {
    Observable.call(this);
    this.id = uid(10);
    this.players = {};
    this.picks = {};
}
Game.prototype = Object.create(Observable.prototype);
Game.prototype.registerPlayer = function(){
    if (!this.finished()) {
        do {
            var id = uid();
        } while(id in this.players);
        this.players[id] = true;
        this.notify({ 'type': 'registration', 'gameId': this.id, 'playerId': id });
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
    this.notify({ 'type': 'pick', 'gameId': this.id, 'playerId': playerId, 'choice': choice });
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
    this.notify({ 'type': 'resolution', 'gameId': this.id });
};
Game.prototype.finished = function(){
    return !!(this.resolution);
};

module.exports = Game;
