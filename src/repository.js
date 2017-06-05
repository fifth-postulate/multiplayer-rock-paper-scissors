function Repository(){
    this.games = {};
};
Repository.prototype.save = function(game, callback) {
    this.games[game.id] = game;
    callback(undefined);
};
Repository.prototype.load = function(id, callback) {
    if (this.games.hasOwnProperty(id)) {
        callback(undefined, this.games[id]);
    } else {
        callback(new Error('no game with id ' + id));
    }
};

module.exports = Repository;
