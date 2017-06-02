const assert = require('chai').assert;

const Game = require('../src/game.js');

describe('In a game', function(){
    describe('a player', function(){
        it('should have an identifier', function(){
            const game = new Game();

            var playerId = game.registerPlayer();

            assert.exists(playerId);
        });

        it('should have an unique identifier', function(){
            const game = new Game();

            var playerOneId = game.registerPlayer();
            var playerTwoId = game.registerPlayer();

            assert.notEqual(playerOneId, playerTwoId);
        });
    });
});
