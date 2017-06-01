function Game() {
    this.nextIdentifier = 1;
}
Game.prototype.registerPlayer = function(){
    return this.nextIdentifier++;
};

module.exports = Game;
