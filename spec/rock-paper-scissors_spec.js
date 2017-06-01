const assert = require('chai').assert;

const Game = require('../src/game.js');

describe('In a game', function(){
    describe('players', function(){
        it('should have identifiers', function(){
            const game = new Game();

            var playerId = game.registerPlayer();

            assert.exists(playerId);
        });

        it('should have unique identifiers', function(){
            const game = new Game();

            var playerOneId = game.registerPlayer();
            var playerTwoId = game.registerPlayer();

            assert.notEqual(playerOneId, playerTwoId);
        });
    });
});
