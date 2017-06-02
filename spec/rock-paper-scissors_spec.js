const assert = require('chai').assert;

const Game = require('../src/game.js');

describe('In a game', function(){
    describe('a player', function(){
        it('should have an identifier', function(){
            const game = new Game();

            const playerId = game.registerPlayer();

            assert.exists(playerId);
        });

        it('should have an unique identifier', function(){
            const game = new Game();

            const playerOneId = game.registerPlayer();
            const playerTwoId = game.registerPlayer();

            assert.notEqual(playerOneId, playerTwoId);
        });
    });

    describe('in a round', function(){
        let game, playerOneId, playerTwoId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
        });

        it('rock crushes scissors', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId]);
            assert.deepEqual(losers, [playerTwoId]);
        });

        it('scissors cuts paper', function(){
            game.pick(playerOneId, 'scissors');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId]);
            assert.deepEqual(losers, [playerTwoId]);
        });

        it('paper wraps rock', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId]);
            assert.deepEqual(losers, [playerTwoId]);
        });

        it('same picks only knows winners', function(){
            game.pick(playerOneId, 'paper');
            game.pick(playerTwoId, 'paper');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId, playerTwoId]);
            assert.deepEqual(losers, []);
        });
    });

    describe('in a round with more than two players', function(){
        let game, playerOneId, playerTwoId, playerThreeId;

        beforeEach(function(){
            game = new Game();
            playerOneId = game.registerPlayer();
            playerTwoId = game.registerPlayer();
            playerThreeId = game.registerPlayer();
        });

        it('normal rules still apply, even when a minority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'scissors');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId]);
            assert.deepEqual(losers, [playerTwoId, playerThreeId]);
        });

        it('normal rules still apply, even when a majority', function(){
            game.pick(playerOneId, 'rock');
            game.pick(playerTwoId, 'scissors');
            game.pick(playerThreeId, 'rock');

            let winners = game.winners();
            let losers = game.losers();

            assert.deepEqual(winners, [playerOneId, playerThreeId]);
            assert.deepEqual(losers, [playerTwoId]);
        });
   });
});
