const assert = require('chai').assert;

const Game = require('../src/game.js');

describe('a game', function(){
    it('should register players', function(){
        const game = new Game();

        var playerId = game.registerPlayer();

        assert.exists(playerId);
    });
});
