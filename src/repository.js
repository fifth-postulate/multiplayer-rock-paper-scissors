function Repository(){
    this.games = {};
};
Repository.prototype.save = function(game) {
    this.games[game.id] = game;
};
Repository.prototype.load = function(id) {
    return this.games[id];
};

module.exports = Repository;
