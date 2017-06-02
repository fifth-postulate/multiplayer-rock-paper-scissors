const uid = require('./uid.js');

function Game() {
    this.players = {};
}
Game.prototype.registerPlayer = function(){
    do {
        var id = uid();
    } while(id in this.players);
    this.players[id] = true;
    return id;
};

module.exports = Game;
